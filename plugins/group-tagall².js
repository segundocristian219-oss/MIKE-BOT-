// Guardamos el emoji por grupo en memoria
const groupEmojis = {}; // { chatId: emoji }

const handler = async (m, { conn, participants, isAdmin, isOwner }) => {
  if (!m.isGroup) return;
  if (!isAdmin && !isOwner) return global.dfail?.('admin', m, conn);

  const chatId = m.chat;
  const text = m.text || m.msg?.caption || '';

  // Separar comando y argumentos
  const args = text.trim().split(/\s+/);
  const cmd = args[0].toLowerCase();
  const param = args.slice(1).join(' ');

  if (cmd === '.setemoji') {
    if (!param) return conn.sendMessage(chatId, { text: '❌ Envía un emoji después del comando' });
    groupEmojis[chatId] = param;
    return conn.sendMessage(chatId, { text: `✅ Emoji cambiado a: ${param}` });
  }

  if (cmd === '.todos') {
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