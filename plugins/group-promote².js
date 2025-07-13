let handler = async (m, { conn, text, quoted }) => {
  let user;

  if (m.mentionedJid?.length) {
    user = m.mentionedJid[0];
  } else if (quoted?.participant) {
    user = quoted.participant;
  } else if (quoted?.sender) {
    user = quoted.sender;
  } else if (text && !isNaN(text)) {
    user = text + '@s.whatsapp.net';
  } else {
    return conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
  }

  if (!user || user.length > 25 || user.length < 15) {
    return conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
  }

  await conn.groupParticipantsUpdate(m.chat, [user], 'promote');
};

handler.customPrefix = /^(promote)/i;
handler.command = new RegExp;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;