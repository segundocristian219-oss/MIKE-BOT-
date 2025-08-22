const groupEmojis = {}; // { chatId: emoji }

const handler = async (m, { conn, participants, isAdmin, isOwner }) => {
  if (!m.isGroup) return;
  if (!isAdmin && !isOwner) return global.dfail?.('admin', m, conn);

  const chatId = m.chat;
  const text = m.text || m.msg?.caption || '';

  // Detectar comando con regex
  const setEmojiMatch = text.match(/^\.setemoji\s+(.+)$/i);
  const todosMatch = text.match(/^\.todos$/i);

  if (setEmojiMatch) {
    const newEmoji = setEmojiMatch[1].trim();
    groupEmojis[chatId] = newEmoji;
    return conn.sendMessage(chatId, { text: `✅ Emoji cambiado a: ${newEmoji}` });
  }

  if (todosMatch) {
    const emoji = groupEmojis[chatId] || '🗣️';
    const total = participants.length;

    let mensaje = `*!  MENCION GENERAL  !*\n`;
    mensaje += `*PARA ${total} MIEMBROS* ${emoji}\n\n`;

    for (const user of participants) {
      const numero = user.id.split('@')[0];
      mensaje += `${emoji} @${numero}\n`;
    }

    return conn.sendMessage(chatId, {
      text: mensaje,
      mentions: participants.map(p => p.id)
    });
  }
};

handler.customPrefix = /^\.?(todos|setemoji)$/i;
handler.group = true;
handler.admin = true;

export default handler;