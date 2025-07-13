let handler = async (m, { conn, text, quoted }) => {
  let user =
    m.mentionedJid?.[0] ||
    quoted?.sender ||
    (text && text.match(/\d{8,}/g)?.[0] + '@s.whatsapp.net');

  if (!user || user.length > 25) {
    return conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
  }

  await conn.groupParticipantsUpdate(m.chat, [user], 'promote');
};

handler.customPrefix = /^(promote)/i; // sin prefijo, estilo: promote @
handler.command = new RegExp;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;