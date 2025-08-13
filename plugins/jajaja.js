
import fetch from 'node-fetch';
import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command}) => {
  m.react('😈');

  let txt = '';
  let img = 'https://delirius-apiofc.vercel.app/nsfw/girls';

  const textRandom = [
    "𝗣𝗼𝗿𝗻𝗶𝘁𝗼 𝗥𝗶𝗰𝗼 😈",
    "𝗣𝗼𝗿𝗻𝗶𝘁𝗼 𝗥𝗶𝗰𝗼 😈",
    "𝗣𝗼𝗿𝗻𝗶𝘁𝗼 𝗥𝗶𝗰𝗼 😈"
  ];

  const imgRandom = [
    "https://cdn.russellxz.click/c3cf443a.jpeg",
    "https://cdn.russellxz.click/c3cf443a.jpeg"
  ];

  const msjRandom = textRandom[Math.floor(Math.random() * textRandom.length)];
  const imgSelected = imgRandom[Math.floor(Math.random() * imgRandom.length)];
  const thumb = Buffer.from((await axios.get(imgSelected, { responseType: 'arraybuffer'})).data);

  const izumi = {
    key: { participants: "0@s.whatsapp.net", fromMe: false, id: "Halo"},
    message: {
      locationMessage: {
        name: msjRandom,
        jpegThumbnail: thumb,
        vcard:
          "BEGIN:VCARD\nVERSION:3.0\nN:;Unlimited;;;\nFN:Unlimited\nORG:Unlimited\nTITLE:\n" +
          "item1.TEL;waid=19709001746:+1 (970) 900-1746\nitem1.X-ABLabel:Unlimited\n" +
          "X-WA-BIZ-DESCRIPTION:ofc\nX-WA-BIZ-NAME:Unlimited\nEND:VCARD"
}
},
    participant: "0@s.whatsapp.net"
};

  m.react('😈');
  conn.sendMessage(m.chat, { image: { url: img}, caption: txt}, { quoted: izumi});
};

handler.command = ['pack'];

export default handler;