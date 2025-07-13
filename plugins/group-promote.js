const handler = async (m, { conn, text, quoted }) => {
  let target = null;

  if (quoted) {
    // tratar de obtener el número desde varias posibles propiedades
    target =
      (quoted.key && quoted.key.participant) ||
      quoted.participant ||
      quoted.sender ||
      (quoted.key && quoted.key.remoteJid);
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