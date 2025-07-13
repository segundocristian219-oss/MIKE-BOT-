let handler = async (m, { conn, text, quoted }) => {
  let number;

  if (isNaN(text) && !text.includes('@')) {
    return conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
  } else if (text.includes('@')) {
    number = text.replace(/[^0-9]/g, '');
  } else {
    number = text;
  }

  if (!text && !quoted) {
    return conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
  }

  if (number && (number.length > 13 || number.length < 8)) {
    return conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
  }

  let user;

  try {
    if (text && number) {
      user = number + "@s.whatsapp.net";
    } else if (quoted?.sender) {
      user = quoted.sender;
    }
  } catch {}

  if (!user) {
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