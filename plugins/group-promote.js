const handler = async (m, { conn, text, quoted }) => {
  const u = (text || quoted?.sender)?.replace(/\D/g, '');
  if (!u) return await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });

  await conn.groupParticipantsUpdate(m.chat, [u + '@s.whatsapp.net'], 'promote');
};

handler.command = /^(promote|daradmin|darpoder)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;