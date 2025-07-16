let handler = async (m, { conn, isAdmin, isOwner }) => {
  if (!m.isGroup) return global.dfail('group', m, conn);
  if (!isAdmin && !isOwner) return global.dfail('admin', m, conn);

  const user = m.quoted?.sender;
  if (!user) return m.reply('⚠️ Responde al mensaje del usuario que quieres silenciar.');

  const chat = global.db.data.chats[m.chat] ??= {};
  chat.mutedUsers ??= [];

  if (chat.mutedUsers.includes(user)) {
    return m.reply('⛔ Ese usuario ya está muteado.');
  }

  chat.mutedUsers.push(user);

  await conn.sendMessage(m.chat, {
    text: `🔇 El usuario @${user.split('@')[0]} ha sido silenciado.`,
    mentions: [user]
  }, { quoted: m });
};

handler.command = ['mute'];
handler.tags = ['group'];
handler.help = ['mute (responde al usuario)'];
handler.group = true;
handler.admin = true;

export default handler;