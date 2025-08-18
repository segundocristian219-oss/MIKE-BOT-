let handler = async (m, { conn }) => {
  const body = m.text?.trim();
  let user;

  // Caso 1: "demote @usuario"
  if (/^demote\s+@/i.test(body)) {
    const mentioned = m.mentionedJid || m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    if (!mentioned || !mentioned.length) {
      return conn.sendMessage(m.chat, { react: { text: '☁️', key: m.key } });
    }
    user = mentioned[0];
  } 
  // Caso 2: responder con "demote"
  else if (/^demote$/i.test(body)) {
    user = m.quoted?.sender;
    if (!user) {
      return conn.sendMessage(m.chat, { react: { text: '☁️', key: m.key } });
    }
  } 
  else return;

  // Validación simple del usuario
  if (!user || typeof user !== 'string' || !user.includes('@s.whatsapp.net')) {
    return conn.sendMessage(m.chat, { react: { text: '☁️', key: m.key } });
  }

  // Ejecutar demote
  await conn.groupParticipantsUpdate(m.chat, [user], 'demote');
};

handler.customPrefix = /^demote/i;
handler.command = new RegExp();
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;