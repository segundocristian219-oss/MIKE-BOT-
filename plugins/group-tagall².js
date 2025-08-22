// Guardamos el emoji globalmente por grupo
const groupEmojis = {}; // { chatId: emoji }

const handler = async (m, { conn, participants, isAdmin, isOwner, command, text }) => {
  if (!m.isGroup) return;
  if (!isAdmin && !isOwner) return global.dfail?.('admin', m, conn);

  const chatId = m.chat;

  if (command.toLowerCase() === 'setemoji') {
    // Cambiar emoji
    const newEmoji = text?.trim();
    if (!newEmoji) return conn.sendMessage(chatId, { text: '❌ Envía un emoji después del comando' });
    groupEmojis[chatId] = newEmoji;
    return conn.sendMessage(chatId, { text: `✅ Emoji cambiado a: ${newEmoji}` });
  }

  // Comando .todos
  const emoji = groupEmojis[chatId] || '🗣️';
  const total = participants.length;

  let mensaje = `*!  MENCION GENERAL  !*\n`;
  mensaje += `*PARA ${total} MIEMBROS* ${emoji}\n\n`;

  for (const user of participants) {
    const numero = user.id.split('@')[0];
    mensaje += `${emoji} @${numero}\n`;
  }

  await conn.sendMessage(chatId, {
    text: mensaje,
    mentions: participants.map(p => p.id)
  });
};

handler.customPrefix = /^\.?(todos|setemoji)$/i;
handler.group = true;
handler.admin = true;

export default handler;