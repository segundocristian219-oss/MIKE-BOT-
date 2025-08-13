import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

const handler = async (m, { conn, args, command, usedPrefix }) => {
  if (!global.db.data.chats[m.chat].nsfw && m.isGroup) {
    return m.reply('*[❗] Los comandos +18 están desactivados en este grupo.*\n> Si es admin y desea activarlos use .enable nsfw');
  }

  if (!args[0]) throw `*[❗INFO❗] Ingrese un enlace válido de XNXX, ejemplo:\n${usedPrefix + command} https://www.xnxx.com/video-14lcwbe8/rubia_novia_follada_en_cuarto_de_bano*`;

  try {
    await conn.reply(m.chat, '[❗] Procesando video, espere...', m);

    let xnxxLink = args[0];
    const res = await xnxxdl(xnxxLink);
    console.log("📄 Datos extraídos:", res);

    const json = res.result.files;
    await conn.sendMessage(
      m.chat,
      {
        document: { url: json.high || json.low },
        mimetype: 'video/mp4',
        fileName: res.result.title || 'video.mp4'
      },
      { quoted: m }
    );
  } catch (err) {
    console.error("❌ Error:", err);
    throw `*[❗INFO❗] Error: ${err}*`;
  }
};

handler.command = ['xnxxx'];
export default handler;

async function xnxxdl(URL) {
  return new Promise((resolve, reject) => {
    fetch(URL).then(res => res.text()).then(res => {
      const $ = cheerio.load(res);
      const title = $('meta[property="og:title"]').attr('content');
      const duration = $('meta[property="og:duration"]').attr('content');
      const image = $('meta[property="og:image"]').attr('content');
      const videoScript = $('script:contains("html5player.setVideoUrlHigh")').html() || '';

      const files = {
        low: (videoScript.match(/html5player\.setVideoUrlLow\('(.*?)'\);/) || [])[1],
        high: (videoScript.match(/html5player\.setVideoUrlHigh\('(.*?)'\);/) || [])[1],
        HLS: (videoScript.match(/html5player\.setVideoHLS\('(.*?)'\);/) || [])[1],
      };

      resolve({ status: 200, result: { title, URL, duration, image, files } });
    }).catch(err => reject(err));
  });
}