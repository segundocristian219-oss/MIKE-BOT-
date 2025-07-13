let handler = async (m, { conn, text }) => {
  let number;

  if (isNaN(text) && !text.match(/@/g)) {
    // no hacemos nada si texto no tiene número ni mención
  } else if (isNaN(text)) {
    number = text.split`@`[1];
  } else if (!isNaN(text)) {
    number = text;
  }

  if (!text && !m.quoted) {
    return conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
  }

  if (number && (number.length > 13 || (number.length < 11 && number.length > 0))) {
    return conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
  }

  let user;

  try {
    if (text) {
      user = number + "@s.whatsapp.net";
    } else if (m.quoted && m.quoted.sender) {
      user = m.quoted.sender;
    }
  } catch {}

  if (!user) {
    return conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
  }

  await conn.groupParticipantsUpdate(m.chat, [user], "promote");
};

handler.help = ["@usuario*"].map((v) => "promote " + v);
handler.tags = ["group"];
handler.command = /^(promote|daradmin|darpoder)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;
handler.fail = null;

export default handler;