let handler = async (m, { conn }) => {
  const body = m.text?.trim();
  if (!body || !/^\.?demote/i.test(body)) return;

  let user;

  // 1️⃣ Usuario mencionado
  const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
  if (mentioned?.length) user = mentioned[0];

  // 2️⃣ Usuario de mensaje citado
  if (!user && m.quoted) user = m.quoted.key?.participant;

  // Si no hay usuario válido, solo reaccionar con la nube
  if (!user || !user.endsWith('@s.whatsapp.net')) {
    return conn.sendMessage(m.chat, { react: { text: '☁️', key: m.key } });
  }

  try {
    // ⚡ Demote usando ds6/meta
    await conn.groupParticipantsUpdate(m.chat, [user], 'demote');

    // Reacción como confirmación
    await conn.sendMessage(m.chat, { react: { text: '☁️', key: m.key } });
  } catch (e) {
    // Reaccionar con la nube si falla
    return conn.sendMessage(m.chat, { react: { text: '☁️', key: m.key } });
  }
};

handler.customPrefix = /^\.?demote/i;
handler.command = new RegExp();
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;