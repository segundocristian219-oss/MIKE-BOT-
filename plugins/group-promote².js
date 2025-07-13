let handler = async (m, { conn, text }) => {
  // Validar que haya texto Y una mención válida
  if (!text || !m.mentionedJid || m.mentionedJid.length === 0) {
    return conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
  }

  let user = m.mentionedJid[0];

  if (!user || !/@s\.whatsapp\.net$/.test(user)) {
    return conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
  }

  await conn.groupParticipantsUpdate(m.chat, [user], 'promote');
};

handler.customPrefix = /^promote$/i; // Solo si escribes: promote @...
handler.command = new RegExp();      // sin prefijo
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;