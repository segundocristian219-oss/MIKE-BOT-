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



async (m, { conn, quoted }) => {
  if (!quoted) 
    return conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });

  let user = quoted.participant || quoted.sender || quoted.key?.participant;

  if (!user || user.length < 15 || user.length > 25)
    return conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });

  await conn.groupParticipantsUpdate(m.chat, [user], 'promote');
};

handler.customPrefix = /^(promote)$/i;  // Solo para mensaje que diga exactamente "promote"
handler.command = new RegExp;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;