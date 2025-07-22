import yts from 'yt-search';
import fs from 'fs';
import axios from 'axios';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const MAX_RETRIES = 2;
const TIMEOUT_MS = 10000;
const RETRY_DELAY_MS = 8000;

const isUserBlocked = (userId) => {
  try {
    const blockedUsers = JSON.parse(fs.readFileSync('./bloqueados.json', 'utf8'));
    return blockedUsers.includes(userId);
  } catch {
    return false;
  }
};

const getDownloadUrl = async (videoUrl) => {
  const apis = [
    { url: 'https://api.zenkey.my.id/api/download/ytmp3?apikey=zenkey&url=', type: 'zenkey' },
    { url: 'https://api.vreden.my.id/api/ytmp3?url=', type: 'vreden' },
    { url: 'https://delirius-api.tech/api/dowloader/ytmp3?url=', type: 'delirius' },
  ];

  for (const api of apis) {
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const response = await axios.get(`${api.url}${encodeURIComponent(videoUrl)}`, { timeout: TIMEOUT_MS });

        // Detectar estructura dependiendo de la API
        const res = response.data;
        const downloadUrl =
          res.result?.download?.url || res.result?.url || res.result?.link || res.result?.descarga;

        if (downloadUrl) {
          return {
            url: downloadUrl.trim(),
            title: res.result?.metadata?.title || res.result?.title || 'Audio Descargado',
          };
        }
      } catch {
        if (attempt < MAX_RETRIES - 1) await wait(RETRY_DELAY_MS);
      }
    }
  }
  return null;
};

const handler = async (m, { conn, text, usedPrefix, command }) => {
  const userId = m.sender;
  if (isUserBlocked(userId)) {
    return conn.reply(m.chat, '🚫 Lo siento, estás en la lista de usuarios bloqueados.', m);
  }

  if (!text?.trim()) {
    return conn.reply(m.chat, `📌 Uso: ${usedPrefix + command} <nombre de la canción>\n📍 Ejemplo: ${usedPrefix + command} Let Go`, m);
  }

  await conn.sendMessage(m.chat, { react: { text: '🔎', key: m.key } }, { quoted: m });

  try {
    const searchResults = await yts(text.trim());
    if (!searchResults?.videos?.length) throw new Error('No se encontraron resultados en YouTube.');

    const videoInfo = searchResults.videos[0];
    const { title, timestamp: duration, views, ago, url: videoUrl, image } = videoInfo;

    const caption = `🎵 *Título:* ${title}
📺 *Canal:* ${videoInfo.author.name}
⏱ *Duración:* ${duration || 'Desconocida'}
👀 *Vistas:* ${views.toLocaleString()}
📅 *Publicado:* ${ago || 'Desconocido'}
🔗 *Enlace:* ${videoUrl}`;

    const thumbRes = await axios.get(image, { responseType: 'arraybuffer' });
    const thumb = Buffer.from(thumbRes.data, 'binary');

    await conn.sendMessage(m.chat, {
      image: thumb,
      caption,
      jpegThumbnail: thumb,
    }, { quoted: m });

    const downloadData = await getDownloadUrl(videoUrl);
    if (!downloadData?.url) {
      await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } }, { quoted: m });
      throw new Error('No se pudo descargar el audio.');
    }

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } }, { quoted: m });

    await conn.sendMessage(
      m.chat,
      {
        audio: { url: downloadData.url },
        mimetype: 'audio/mpeg',
        contextInfo: {
          externalAdReply: {
            title: downloadData.title,
            body: '𝐳𝐳𝐳 Music',
            previewType: 'PHOTO',
            thumbnail: thumb,
            mediaType: 1,
            renderLargerThumbnail: false,
            showAdAttribution: true,
          }
        }
      },
      { quoted: m }
    );

  } catch (error) {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } }, { quoted: m });
    return conn.reply(m.chat, `🚨 *Error:* ${error.message || 'Error desconocido.'}`, m);
  }
};

handler.command = /^play$/i;
handler.help = ['play <texto>'];
handler.tags = ['descargas'];

export default handler;