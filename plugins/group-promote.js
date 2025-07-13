const handler = async (m, { conn, text, quoted }) => {
  let id = quoted?.sender || (text?.replace(/\D/g, '') ? text.replace(/\D/g, '') + '@s.whatsapp.net' : null);
  if (!id) return await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });

  await conn.groupParticipantsUpdate(m.chat, [id], 'promote');
};

handler.command = /^(promote|daradmin|darpoder)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;