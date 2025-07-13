let handler = async (m, { conn }) => {
  const body = m.text?.trim().toLowerCase();

  // Solo si el texto es "promote" exacto
  if (body !== 'promote') return;

  // Solo si estás respondiendo a alguien
  const user = m.quoted?.sender;
  if (!user) {
    return conn.sendMessage(m.chat, { react: { text: '', key: m.key } });
  }

  await conn.groupParticipantsUpdate(m.chat, [user], 'promote');
};

handler.customPrefix = /^promote$/i; // Solo si escribes exactamente "promote"
handler.command = new RegExp();      // sin prefijo
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;