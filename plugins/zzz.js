// yaoi.js
import fetch from 'node-fetch';

const handler = async (m, { conn }) => {
  // Asegurar estructura de db
  db.data = db.data || {};
  db.data.chats = db.data.chats || {};
  db.data.chats[m.chat] = db.data.chats[m.chat] || { modohorny: false };

  // Verificar modohorny
  if (!db.data.chats[m.chat].modohorny && m.isGroup) {
    throw '⚠ 𝙇𝙊𝙎 𝘾𝙊𝙈𝘼𝙉𝘿𝙊𝙎 +18 𝙀𝙎𝙏𝘼𝙉 𝘿𝙀𝙎𝘼𝘾𝙏𝙄𝙑𝘼𝘿𝙊𝙎 𝙀𝙉 𝙀𝙎𝙏𝙀 𝙂𝙍𝙐𝙋𝙊';
  }

  // API
  const res = await fetch(`https://nekobot.xyz/api/image?type=yaoi`);
  const json = await res.json();
  const url = json.message;

  // Enviar imagen
  await conn.sendMessage(m.chat, { image: { url }, caption: `_yaoi_` }, { quoted: m });
};

handler.help = ['yaoi'];
handler.tags = ['nsfw'];
handler.command = ['yaoi'];
handler.group = true;

export default handler;