let handler = async (m, { conn, usedPrefix, command }) => {
  const img = 'https://qu.ax/WhnpY.jpg';
  const name = await conn.getName(m.sender);
  const text = `🪙 𝐌 𝐔 𝐋 𝐓 𝐈 - 𝐌 𝐄 𝐍 𝐔́ 


 `.trim();

  await conn.sendMessage(m.chat, { image: { url: img }, caption: text }, { quoted: m });
};

handler.customPrefix = /^(menu|menú|ayuda|help)$/i;
handler.command = new RegExp; // para que funcione sin prefijo
handler.register = true;

export default handler;