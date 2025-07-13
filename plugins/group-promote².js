let handler = async (m, { conn }) => {
  const body = m.text?.trim();
  const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;

  // Solo si el mensaje es exactamente "promote @usuario"
  if (!body || !/^promote\s+@/i.test(body)) {
    return;
  }

  if (!mentioned || !mentioned.length) {
    return conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
  }

  const user = mentioned[0];

  if (!user || typeof user !== 'string' || !user.endsWith('@s.whatsapp.net')) {
    return conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
  }

  await conn.groupParticipantsUpdate(m.chat, [user], 'promote');
};

handler.customPrefix = /^promote\s+@/i; // Solo si el mensaje inicia con: promote @
handler.command = new RegExp();         // Sin prefijo
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;