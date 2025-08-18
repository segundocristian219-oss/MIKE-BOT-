let handler = async (m, { conn }) => {
  const body = m.text?.trim();
  const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
  let user;

  // Caso 1: Demote usando "demote @usuario"
  if (/^demote\s+@/i.test(body)) {
    if (!mentioned || !mentioned.length) {
      return conn.sendMessage(m.chat, { react: { text: '☁️', key: m.key } });
    }
    user = mentioned[0];
  } 
  // Caso 2: Responder a un mensaje con "demote"
  else if (/^demote$/i.test(body)) {
    user = m.quoted?.sender;
    if (!user) {
      return conn.sendMessage(m.chat, { react: { text: '☁️', key: m.key } });
    }
  } 
  // Si no cumple ninguno, salir
  else {
    return;
  }

  // Validación básica del usuario
  if (!user || typeof user !== 'string' || !user.endsWith('@s.whatsapp.net')) {
    return conn.sendMessage(m.chat, { react: { text: '☁️', key: m.key } });
  }

  // Ejecutar el demote
  await conn.groupParticipantsUpdate(m.chat, [user], 'demote');
};

handler.customPrefix = /^demote/i;
handler.command = new RegExp();
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;