const handler = async (m, { conn, text, quoted }) => {
  const target = quoted?.sender || (text?.replace(/\D/g, '') && (text.replace(/\D/g, '') + '@s.whatsapp.net'));
  if (!target) return await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });

  await conn.groupParticipantsUpdate(m.chat, [target], 'promote');
};

handler.command = /^(promote|daradmin|darpoder)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;