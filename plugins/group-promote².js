let handler = async (m, { conn }) => {
  const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;

  // Si no hay mención real
  if (!mentioned || !mentioned.length) {
    return conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
  }

  const user = mentioned[0];

  // Si el formato del ID no es válido
  if (!user || typeof user !== 'string' || !user.endsWith('@s.whatsapp.net')) {
    return conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
  }

  try {
    await conn.groupParticipantsUpdate(m.chat, [user], 'promote');
  } catch (e) {
    return conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
  }
};

handler.customPrefix = /^promote$/i; // solo 'promote'
handler.command = new RegExp();      // sin prefijo
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;