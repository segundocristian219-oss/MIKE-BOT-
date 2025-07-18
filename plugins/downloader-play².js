import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
  if (!text) {
    return m.reply(
      `╭─⬣「 *𝐁𝐚𝐫𝐝𝐨𝐜𝐤 𝐁𝐨𝐭* 」⬣
│ ≡◦ 🎧 *Uso correcto del comando:*
│ ≡◦ play shakira soltera
╰─⬣`
    );
  }

  try {
    const res = await fetch(`https://api.nekorinn.my.id/downloader/spotifyplay?q=${encodeURIComponent(text)}`);
    const json = await res.json();

    if (!json.status || !json.result?.downloadUrl) {
      return m.reply(
        `╭─⬣「 *𝐁𝐚𝐫𝐝𝐨𝐜𝐤 𝐁𝐨𝐭* 」⬣
│ ≡◦ ❌ *No se encontró resultado para:* ${text}
╰─⬣`
      );
    }

    const { title, artist, duration, cover, url } = json.result.metadata;
    const audio = json.result.downloadUrl;

    await conn.sendMessage(m.chat, {
      image: { url: cover },
            caption: `🎵 *Título:* ${title}
📺 *Canal:* ${artist}
⏱️ *Duración:* ${duration}
🌐 *Spotify:* ${url}`
    }, { quoted: m });

    await conn.sendMessage(m.chat, {
      audio: { url: audio },
      mimetype: 'audio/mp4',
      ptt: false,
      fileName: `${title}.mp3`
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    return m.reply(
      `╭─⬣「 *𝐁𝐚𝐫𝐝𝐨𝐜𝐤 𝐁𝐨𝐭* 」⬣
│ ≡◦ ⚠️ *Error al procesar la solicitud.*
│ ≡◦ Intenta nuevamente más tarde.
╰─⬣`
    );
  }
};

handler.customPrefix = /^play\s+/i;
handler.command = new RegExp;
handler.register = false;

export default handler;