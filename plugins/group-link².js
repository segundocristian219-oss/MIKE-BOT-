const handler = async (m, { conn, isAdmin }) => {
  if (!isAdmin) return;

  conn.sendMessage(m.chat, { text: 'https://chat.whatsapp.com/' + await conn.groupInviteCode(m.chat) });
};

handler.command = /^link$/i; // sin prefijo, detecta solo "link"
handler.group = true;
handler.botAdmin = true;
handler.customPrefix = /^link$/i;
handler.explicit = true;

export default handler;