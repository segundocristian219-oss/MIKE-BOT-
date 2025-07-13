let handler = async (m, { conn, text, quoted }) => {
  let number;

  if (m.mentionedJid?.length) {
    number = m.mentionedJid[0].split('@')[0];
  } else if (!isNaN(text)) {
    number = text;
  } else if (quoted) {
    number = quoted.sender.split('@')[0];
  } else {
    return conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
  }

  if (!number || number.length > 13 || number.length < 8) {
    return conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
  }

  let user = number + "@s.whatsapp.net";

  await conn.groupParticipantsUpdate(m.chat, [user], "promote");
};

handler.customPrefix = /^(promote)/i;
handler.command = new RegExp;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;



const handler = async (m, { conn, participants }) => {
  const texto = (m.text || '').trim().toLowerCase()

  // Activadores exactos sin prefijo
  if (!/^promote$|^ascender$|^admin$/i.test(texto)) return
  if (!m.isGroup) return

  const userSender = participants.find(u => u.id === m.sender)
  const botSender = participants.find(u => u.id === conn.user.jid)

  if (!userSender?.admin) return
  if (!botSender?.admin) return

  const targets = m.mentionedJid?.length
    ? m.mentionedJid
    : m.quoted
    ? [m.quoted.sender]
    : []

  if (!targets.length) return

  try {
    await conn.groupParticipantsUpdate(m.chat, targets, 'promote')
  } catch (err) {}
}

handler.customPrefix = /^promote$|^ascender$|^admin$/i
handler.command = new RegExp // solo sin prefijo
handler.group = true
handler.admin = true
handler.botAdmin = true
  