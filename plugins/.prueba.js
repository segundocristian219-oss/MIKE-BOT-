const handler = async (m, { conn, quoted, command }) => {
  if (!quoted || quoted.mtype !== 'stickerMessage') {
    return m.reply('❌ Responde a un sticker con el comando *.' + command + '* para obtener su hash.');
  }

  try {
    const hash = quoted.msg.fileSha256?.toString('base64');
    if (!hash) return m.reply('⚠️ No se pudo obtener el hash del sticker.');

    await m.reply(`🧩 *Hash del sticker:*\n${hash}`);
  } catch (e) {
    console.error(e);
    await m.reply('❌ Ocurrió un error al obtener el hash.');
  }
};

handler.command = /^(hash|código)$/i;
handler.group = true; // o false si quieres que funcione en privado también

export default handler;