const handler = async (m, { conn, args }) => {
  if (!args.length) return; // No args, no hace nada
  const text = encodeURIComponent(args.join(' '));
  try {
    await conn.sendMessage(m.chat, {
      sticker: { url: `https://api.siputzx.my.id/api/m/brat?text=${text}` }
    });
  } catch (e) {
    console.error('Error enviando sticker:', e);
    await conn.sendMessage(m.chat, { text: 'Error al enviar sticker.' });
  }
};

handler.command = /^brat$/i;

export default handler;