const handler = async (m, { conn, text, quoted }) => {
  let target = null;

  if (quoted) {
    // El participante en mensajes de grupo suele estar en quoted.key.participant
    // En caso de mensajes enviados por usuarios, usar quoted.sender
    target = quoted.key?.participant || quoted.participant || quoted.sender;
  } else if (text) {
    const number = text.replace(/\D/g, '');
    if (number.length >= 8) target = number + '@s.whatsapp.net';
  }

  if (!target) return conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });

  await conn.groupParticipantsUpdate(m.chat, [target], 'promote');
};

handler.command = /^(promote|daradmin|darpoder)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;