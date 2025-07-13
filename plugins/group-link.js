async function handler(m, { conn }) {
  let group = m.chat;
  let link = 'https://chat.whatsapp.com/' + await conn.groupInviteCode(group);
  conn.reply(m.chat, link, m);
}

handler.help = ['link'];
handler.tags = ['grupo'];
handler.command = ['link', 'enlace'];
handler.group = true;
handler.botAdmin = true;

export default handler;