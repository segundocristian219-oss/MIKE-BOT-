const handler = async (m, { conn, text, quoted }) => {
  const u = (text || quoted?.sender)?.replace(/\D/g, '');
  if (!u) return m.reply('Así no', m);

  await conn.groupParticipantsUpdate(m.chat, [u + '@s.whatsapp.net'], 'promote');
};

handler.command = /^(promote|daradmin|darpoder)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;