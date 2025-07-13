let handler = async (m, { conn }) => {
  if (!m.mentionedJid?.length) {
    return conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
  }

  let user = m.mentionedJid[0];

  if (!user || user.length < 15 || user.length > 25) {
    return conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
  }

  await conn.groupParticipantsUpdate(m.chat, [user], "promote");
};

handler.customPrefix = /^(promote)/i;
handler.command = new RegExp;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;