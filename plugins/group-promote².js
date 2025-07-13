let handler = async (m, { conn, text, quoted }) => {
  console.log('quoted:', JSON.stringify(quoted, null, 2));

  let user;

  if (m.mentionedJid?.length) {
    user = m.mentionedJid[0];
  } else if (quoted) {
    user = quoted.participant || quoted.sender || quoted.key?.participant;
  } else if (text && !isNaN(text)) {
    user = text + '@s.whatsapp.net';
  } else {
    return conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
  }

  if (!user || user.length < 15 || user.length > 25) {
    return conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
  }

  await conn.groupParticipantsUpdate(m.chat, [user], 'promote');
};

handler.customPrefix = /^(promote)/i;
handler.command = new RegExp();
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;