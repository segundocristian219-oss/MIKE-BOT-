let handler = async (m, { conn }) => {
  const body = m.text?.trim().toLowerCase();

  // Solo si el texto es "demote" exacto
  if (body !== 'demote') return;

  // Solo si estás respondiendo a alguien
  const user = m.quoted?.sender;
  if (!user) {
    // Si no hay usuario citado, reaccionar con ❌ (o vacío si prefieres)
    return conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
  }

  await conn.groupParticipantsUpdate(m.chat, [user], 'demote');
};

handler.customPrefix = /^demote$/i; // Solo si escribes exactamente "demote"
handler.command = new RegExp();    // sin prefijo
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;