const groupEmojis = {}; // Emoji por grupo

const handler = async (m, { conn, participants, isAdmin, isOwner }) => {
  if (!m.isGroup) return;
  if (!isAdmin && !isOwner) return global.dfail?.('admin', m, conn);

  const chatId = m.chat;
  const text = m.text || m.msg?.caption || '';

  // Separar comando y argumento
  const [prefixCmd, ...args] = text.trim().split(/\s+/);
  const command = prefixCmd.replace(/^\./, '').toLowerCase(); // quitar punto si existe

  if (command === 'setemoji') {
    if (!args[0]) return conn.sendMessage(chatId, { text: '❌ Envía un emoji después del comando' });
    groupEmojis[chatId] = args[0];
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

handler.command = ['setemoji', 'todos'];
handler.group = true;
handler.admin = true;

export default handler;