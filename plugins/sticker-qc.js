import { sticker } from '../lib/sticker.js';
import axios from 'axios';

const handler = async (m, { conn, args }) => {
  if (!args[0]) return;

  const text = args.join(" ");
  const pp = await conn.profilePictureUrl(m.sender).catch(_ => 'https://telegra.ph/file/24fa902ead26340f3df2c.png');
  const name = await conn.getName(m.sender);

  const obj = {
    type: "quote",
    format: "png",
    backgroundColor: "#000000",
    width: 512,
    height: 768,
    scale: 2,
    messages: [{
      entities: [],
      avatar: true,
      from: {
        id: 1,
        name,
        photo: { url: pp }
      },
      text,
      replyMessage: {}
    }]
  };

  const { data } = await axios.post('https://bot.lyo.su/quote/generate', obj, {
    headers: { 'Content-Type': 'application/json' }
  });

  const buffer = Buffer.from(data.result.image, 'base64');
  const stik = await sticker(buffer, false, '', '');
  if (stik) return conn.sendFile(m.chat, stik, 'qc.webp', '', m);
};

handler.command = /^qc$/i;

export default handler;