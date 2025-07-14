let handler = async (m, { conn }) => {
  if (!m.stickerMessage && m.mtype !== 'stickerMessage') return;

  try {
    const buffer = await conn.download(m.msg);
    const hash = m.msg.fileSha256?.toString('base64');

    if (!hash) return m.reply('❌ No se pudo obtener el hash del sticker.');

    console.log('🧩 Hash:', hash);
    await m.reply(`🧩 Hash del sticker:\n${hash}`);
  } catch (e) {
    console.error(e);
    await m.reply('⚠️ Error al procesar el sticker.');
  }
};

handler.customPrefix = /.*/;
handler.command = new RegExp;
handler.private = false;

export default handler;