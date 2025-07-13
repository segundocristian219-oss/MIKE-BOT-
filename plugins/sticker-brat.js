const handler = async (m, { conn, args }) => {
  if (!args.length) return; // No args, no hace nada
  const text = encodeURIComponent(args.join(' '));
  await conn.sendMessage(m.chat, {
    sticker: { url: `https://api.siputzx.my.id/api/m/brat?text=${text}` },
    packname: '',
    author: ''
  });
};

handler.command = /^brat$/i;

export default handler;