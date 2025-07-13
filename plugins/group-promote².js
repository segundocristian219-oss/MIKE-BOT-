let handler = async (m, { conn, text }) => {
  // Solo válido si el mensaje tiene texto y al menos una mención
  if (!text || !m.mentionedJid || !m.mentionedJid.length) {
    return conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
  }

  let user = m.mentionedJid[0];

  if (!user || user.length < 15 || user.length > 25) {
    return conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
  }

  await conn.groupParticipantsUpdate(m.chat, [user], 'promote');
};

handler.customPrefix = /^promote$/i; // Solo funciona con "promote"
handler.command = new RegExp();      // Sin prefijo
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;