let handler = async (m, { conn, isAdmin, isOwner }) => {
  if (!m.isGroup) return global.dfail('group', m, conn);
  if (!isAdmin && !isOwner) return global.dfail('admin', m, conn);

  const user = m.quoted?.sender;
  if (!user) return m.reply('⚠️ Responde al mensaje del usuario que quieras silenciar.');

  const chat = global.db.data.chats[m.chat] || (global.db.data.chats[m.chat] = {});
  chat.mutedUsers = chat.mutedUsers || [];

  if (chat.mutedUsers.includes(user)) {
    return m.reply('⛔ Ese usuario ya está muteado.');
  }

  chat.mutedUsers.push(user);
  m.reply(`✅ Usuario @${user.split("@")[0]} muteado correctamente.`, null, {
    mentions: [user]
  });
};

handler.command = ["mute"];
handler.tags = ["group"];
handler.help = ["mute (respondiendo al usuario)"];

module.exports = handler;