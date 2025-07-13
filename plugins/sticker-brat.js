const handler = async (m, { conn, args }) => 
  args[0] && conn.sendMessage(m.chat, {
    sticker: { url: `https://api.siputzx.my.id/api/m/brat?text=${encodeURIComponent(args.join(' '))}` },
    packname: '', author: ''
  });

handler.command = /^brat$/i;

export default handler;