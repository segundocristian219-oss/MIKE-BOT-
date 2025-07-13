let handler = async (m, { conn, text }) => {
  const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;

  // Solo si hay mención válida
  if (!text || !mentioned || !mentioned.length) {
    return conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
  }

  const user = mentioned[0];

  // Verifica el formato
  if (!user || typeof user !== 'string' || !user.endsWith('@s.whatsapp.net')) {
    return conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
  }

  await conn.groupParticipantsUpdate(m.chat, [user], 'promote');
};

handler.customPrefix = /^promote$/i; // Solo funciona si escribes: promote
handler.command = new RegExp();      // Sin prefijo
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;