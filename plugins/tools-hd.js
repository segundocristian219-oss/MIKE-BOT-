import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import axios from 'axios';
import { downloadContentFromMessage } from '@whiskeysockets/baileys';

const handler = async (msg, { conn, command }) => {
  const chatId = msg.key.remoteJid;
  const pref   = global.prefixes?.[0] || '.';

  const quotedCtx = msg.message?.extendedTextMessage?.contextInfo;
  const quoted    = quotedCtx?.quotedMessage;
  const mediaMsg  = quoted?.imageMessage || quoted?.videoMessage || msg.message?.imageMessage || msg.message?.videoMessage;

  if (!mediaMsg) {
    return conn.sendMessage(chatId, {
      text: `✳️ *Usa:*\n${pref}${command}\n📌 Envía o responde a una imagen o video para mejorarlo.`
    }, { quoted: msg });
  }

  const type = mediaMsg.mimetype?.startsWith('video') ? 'video' : 'image';
  await conn.sendMessage(chatId, { react: { text: '🧪', key: msg.key } });

  try {
    const tmpDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

    const ext = type === 'video' ? 'mp4' : 'jpg';
    const tmpFile = path.join(tmpDir, `${Date.now()}_hd.${ext}`);
    const stream = await downloadContentFromMessage(mediaMsg, type);
    const ws = fs.createWriteStream(tmpFile);
    for await (const chunk of stream) ws.write(chunk);
    ws.end();
    await new Promise(resolve => ws.on('finish', resolve));

    const uploadForm = new FormData();
    uploadForm.append('file', fs.createReadStream(tmpFile));
    const up = await axios.post('https://cdn.russellxz.click/upload.php', uploadForm, {
      headers: uploadForm.getHeaders()
    });
    fs.unlinkSync(tmpFile);
    if (!up.data?.url) throw new Error('No se obtuvo URL al subir al CDN.');
    const mediaUrl = up.data.url;

    const API_KEY    = 'russellxz';
    const REMINI_URL = 'https://api.neoxr.eu/api/remini';
    const rem = await axios.get(
      `${REMINI_URL}?image=${encodeURIComponent(mediaUrl)}&apikey=${API_KEY}`
    );
    if (!rem.data?.status || !rem.data.data?.url) {
      throw new Error('La API no devolvió URL de imagen/video mejorado.');
    }

    if (type === 'video') {
      await conn.sendMessage(chatId, {
        video: { url: rem.data.data.url },
        caption: '✨ Video mejorado con éxito por *La Suki Bot*'
      }, { quoted: msg });
    } else {
      await conn.sendMessage(chatId, {
        image: { url: rem.data.data.url },
        caption: '✨ Imagen mejorada con éxito por *La Suki Bot*'
      }, { quoted: msg });
    }

    await conn.sendMessage(chatId, { react: { text: '✅', key: msg.key } });

  } catch (e) {
    console.error('❌ Error en comando .hd:', e);
    await conn.sendMessage(chatId, {
      text: `❌ *Error:* ${e.message}`
    }, { quoted: msg });
    await conn.sendMessage(chatId, { react: { text: '❌', key: msg.key } });
  }
};

handler.command = ['hd'];
handler.help    = ['hd'];
handler.tags    = ['tools'];
handler.register= true;

export default handler;