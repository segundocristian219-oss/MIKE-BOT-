const handler = async (m, { conn, quoted, command }) => {
  if (!quoted || quoted.mtype !== 'stickerMessage') {
    return m.reply(`❌ Responde a un *sticker* con el comando *.${command}* para obtener su hash.`);
  }

  try {
    const hash = quoted.msg.fileSha256?.toString('base64');
    if (!hash) return m.reply('⚠️ Este sticker no tiene hash disponible.');

    await m.reply(`🧩 *Hash del sticker:*\n${hash}`);
  } catch (e) {
    console.error(e);
    await m.reply('❌ Error al obtener el hash del sticker.');
  }
};

handler.command = /^(hash|código)$/i;
handler.group = false; // o true si lo quieres solo en grupo

export default handler;