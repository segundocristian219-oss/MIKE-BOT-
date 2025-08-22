const groupEmojis = {}; // { chatId: emoji }

const handler = async (m, { conn, participants, isAdmin, isOwner, command, text }) => {
  if (!m.isGroup) return;
  if (!isAdmin && !isOwner) return global.dfail?.('admin', m, conn);

  const chatId = m.chat;

  if (command === 'setemoji') {
    if (!text) return conn.sendMessage(chatId, { text: '❌ Envía un emoji después del comando' });
    groupEmojis[chatId] = text.trim();
    return conn.sendMessage(chatId, { text: `✅ Emoji cambiado a: ${groupEmojis[chatId]}` });
  }

  if (command === 'todos') {
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
handler.command = new RegExp(); // DS6-Meta lo requiere
export default handler;