import { toBuffer } from 'microbuffer'

let handler = async (m, { conn }) => {
  if (!m.msg || !m.msg.fileSha256) return;
  
  // Mostrar el hash en base64 (para que lo puedas copiar)
  let hash = m.msg.fileSha256.toString('base64');
  console.log('Sticker recibido - Hash:', hash);

  await m.reply(`🧩 Hash del sticker:\n${hash}`);
};

handler.customPrefix = /.*/;
handler.command = new RegExp; // se ejecuta siempre
handler.private = false;

export default handler;