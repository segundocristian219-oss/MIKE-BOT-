let handler = async (m, { conn }) => {
  const body = m.text?.trim();

  // Si no empieza con "demote" o ".demote", salir
  if (!body || !/^\.?demote/i.test(body)) return;

  let user;

  // 1️⃣ Intentar tomar al usuario mencionado
  const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
  if (mentioned?.length) {
    user = mentioned[0];
  }

  // 2️⃣ Si no hay mencionado, intentar tomar al remitente del mensaje citado usando LID
  if (!user && m.quoted) {
    user = m.quoted.key?.participant || m.quoted.sender;
  }

  // Validación final
  if (!user || typeof user !== 'string' || !user.endsWith('@s.whatsapp.net')) {
    return conn.sendMessage(m.chat, { react: { text: '☁️', key: m.key } });
  }

  try {
    // Ejecutar demote
    await conn.groupParticipantsUpdate(m.chat, [user], 'demote');
    await conn.sendMessage(m.chat, {
      text: `✅ Se ha quitado admin a @${user.split('@')[0]}`,
      mentions: [user]
    });
  } catch (e) {
    await conn.sendMessage(m.chat, {
      text: '⚠️ No se pudo quitar admin. Asegúrate de que el bot sea admin.',
      mentions: [user]
    });
  }
};

handler.customPrefix = /^\.?demote/i; // detecta "demote" y ".demote"
handler.command = new RegExp();
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;