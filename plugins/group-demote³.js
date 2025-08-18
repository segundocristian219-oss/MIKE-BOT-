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

  // Obtener lista de admins del grupo
  const groupMetadata = await conn.groupMetadata(m.chat);
  const admins = groupMetadata.participants.filter(p => p.admin !== null).map(p => p.id);

  if (!admins.includes(user)) {
    return conn.sendMessage(m.chat, { text: 'Ese usuario no es admin.' });
  }

  // Ejecutar demote
  await conn.groupParticipantsUpdate(m.chat, [user], 'demote');
  conn.sendMessage(m.chat, { text: `Se ha quitado el admin a @${user.split('@')[0]}`, mentions: [user] });
};

handler.customPrefix = /^demote/i;
handler.command = new RegExp();
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;