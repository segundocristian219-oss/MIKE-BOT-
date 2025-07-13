const handler = async (m, { conn }) => {
  conn.reply(m.chat, 'https://chat.whatsapp.com/' + await conn.groupInviteCode(m.chat), m);
};

handler.help = ['link'];
handler.tags = ['grupo'];
handler.command = ['link', 'enlace'];
handler.group = true;
handler.botAdmin = true;

export default handler;