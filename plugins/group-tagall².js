const handler = async (m, { conn, participants, isAdmin, isOwner, command, text }) => {
  if (!m.isGroup) return;
  if (!isAdmin && !isOwner) return global.dfail?.('admin', m, conn);

  const total = participants.length;

  // Detectar si se puso un emoji en el mensaje
  let emoji = '🗣️'; // emoji por defecto
  if (text && text.trim()) {
    emoji = text.trim().split(' ')[0]; // toma el primer "token" como emoji
  }

  let mensaje = `*!  MENCION GENERAL  !*\n`;
  mensaje += `*PARA ${total} MIEMBROS* ${emoji}\n\n`;

  for (const user of participants) {
    const numero = user.id.split('@')[0];
    mensaje += `${emoji} @${numero}\n`;
  }

  await conn.sendMessage(m.chat, {
    text: mensaje,
    mentions: participants.map(p => p.id)
  });
};

handler.customPrefix = /^\.?(todos|.todos|.setemoji)$/i;
handler.command = new RegExp(); // lo puedes dejar así
handler.group = true;
handler.admin = true;

export default handler;