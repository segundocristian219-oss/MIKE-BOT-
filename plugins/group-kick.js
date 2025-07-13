const handler = async (m, { conn }) =>
  m.mentionedJid?.[0] || m.quoted?.sender
    ? (await conn.groupParticipantsUpdate(m.chat, [m.mentionedJid[0] || m.quoted.sender], 'remove'),
       m.reply('☠️ Intruso eliminado.'))
    : m.reply('_Menciona al usuario que deseas eliminar._');

handler.command = ['kick', 'expulsar', 'eliminar'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;