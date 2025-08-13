import axios from 'axios';
import fetch from 'node-fetch';

const handler = async (m, { command, conn }) => {

  // 🔹 Asegurar que la estructura de db exista
  db.data = db.data || {};
  db.data.chats = db.data.chats || {};
  db.data.chats[m.chat] = db.data.chats[m.chat] || { modohorny: false };

  // 🔹 Verificación de modohorny
  if (!db.data.chats[m.chat].modohorny && m.isGroup) {
    throw '⚠ 𝙇𝙊𝙎 𝘾𝙊𝙈𝘼𝙉𝘿𝙊𝙎 +18 𝙀𝙎𝙏𝘼𝙉 𝘿𝙀𝙎𝘼𝘾𝙏𝙄𝙑𝘼𝘿𝙊𝙎 𝙀𝙉 𝙀𝙎𝙏𝙀 𝙂𝙍𝙐𝙋𝙊, 𝙎𝙄 𝙀𝙎 𝘼𝘿𝙈𝙄𝙉 𝙔 𝘿𝙀𝙎𝙀𝘼 𝘼𝘾𝙏𝙄𝙑𝘼𝙍𝙇𝙊𝙎, 𝙐𝙎𝙀 𝙀𝙇 𝘾𝙊𝙈𝘼𝙉𝘿𝙊 .on modohorny\n𝙍𝙀𝘾𝙐𝙀𝙍𝘿𝙀 𝘿𝙀𝙎𝘼𝘾𝙏𝙄𝙑𝘼𝙍 .off modohorny';
  }

  // 🔹 Función auxiliar para obtener imagen
  const sendRandomImage = async (url, caption) => {
    const res = (await axios.get(url)).data;
    const img = res[Math.floor(Math.random() * res.length)];
    conn.sendMessage(m.chat, { image: { url: img }, caption: `_${caption}_`.trim() }, { quoted: m });
  };

  // 🔹 Lista de comandos y sus URLs JSON
  const jsonSources = {
    nsfwloli: 'nsfwloli.json',
    nsfwfoot: 'nsfwfoot.json',
    nsfwass: 'nsfwass.json',
    nsfwbdsm: 'nsfwbdsm.json',
    nsfwcum: 'nsfwcum.json',
    nsfwero: 'nsfwero.json',
    nsfwfemdom: 'nsfwfemdom.json',
    nsfwglass: 'nsfwglass.json',
    hentai: 'hentai.json',
    nsfworgy: 'nsfworgy.json',
    ecchi: 'ecchi.json',
    furro: 'furro.json',
    panties: 'panties.json',
    porno: 'porno.json',
    pechos: 'pechos.json',
    yuri: 'yuri.json'
  };

  // 🔹 Si el comando está en jsonSources
  if (jsonSources[command]) {
    return sendRandomImage(
      `https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/${jsonSources[command]}`,
      command
    );
  }

  // 🔹 Comandos con APIs externas
  if (command === 'trapito') {
    const res = await fetch(`https://api.waifu.pics/nsfw/trap`);
    const json = await res.json();
    return conn.sendMessage(m.chat, { image: { url: json.url }, caption: `_${command}_` }, { quoted: m });
  }

  if (command === 'yaoi') {
    const res = await fetch(`https://nekobot.xyz/api/image?type=yaoi`);
    const json = await res.json();
    return conn.sendMessage(m.chat, { image: { url: json.message }, caption: `_${command}_` }, { quoted: m });
  }

  if (command === 'yaoi2') {
    const res = await fetch(`https://purrbot.site/api/img/nsfw/yaoi/gif`);
    const json = await res.json();
    return conn.sendMessage(m.chat, { image: { url: json.link }, caption: `_${command}_` }, { quoted: m });
  }

  if (command === 'yuri2') {
    const resError = (await axios.get(`https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/yuri.json`)).data;
    const res = await fetch(`https://purrbot.site/api/img/nsfw/yuri/gif`);
    const json = await res.json();
    let url = json.link || resError[Math.floor(Math.random() * resError.length)];
    return conn.sendMessage(m.chat, { image: { url }, caption: `_${command}_` }, { quoted: m });
  }

  // 🔹 Comandos con fallback a JSON si la API falla
  const apiFallback = async (apiUrl, jsonFile, caption) => {
    const resError = (await axios.get(`https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/${jsonFile}`)).data;
    let res = (await conn.getFile(apiUrl)).data;
    if (!res) res = resError[Math.floor(Math.random() * resError.length)];
    conn.sendMessage(m.chat, { image: { url: res }, caption: `_${caption}_` }, { quoted: m });
  };

  if (command === 'tetas') return apiFallback(`https://api-fgmods.ddns.net/api/nsfw/boobs?apikey=fg-dylux`, 'tetas.json', command);
  if (command === 'booty') return apiFallback(`https://api-fgmods.ddns.net/api/nsfw/ass?apikey=fg-dylux`, 'booty.json', command);
  if (command === 'imagenlesbians') return apiFallback(`https://api-fgmods.ddns.net/api/nsfw/lesbian?apikey=fg-dylux`, 'imagenlesbians.json', command);
  if (command === 'pene') return apiFallback(`https://api-fgmods.ddns.net/api/nsfw/penis?apikey=fg-dylux`, 'pene.json', command);

  // 🔹 Comando randomxxx
  if (command === 'randomxxx') {
    const rawjsonn = [
      'tetas.json', 'booty.json', 'imagenlesbians.json',
      'panties.json', 'porno.json'
    ];
    const chosen = rawjsonn[Math.floor(Math.random() * rawjsonn.length)];
    return sendRandomImage(
      `https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/${chosen}`,
      command
    );
  }
};

handler.help = ['nsfwloli', 'nsfwfoot', 'nsfwass', 'nsfwbdsm', 'nsfwcum', 'nsfwero', 'nsfwfemdom', 'nsfwfoot', 'nsfwglass', 'nsfworgy', 'yuri', 'yuri2', 'yaoi', 'yaoi2', 'panties', 'tetas', 'booty', 'ecchi', 'furro', 'hentai', 'trapito', 'imagenlesbians', 'pene', 'porno', 'randomxxx', 'pechos'];
handler.command = ['nsfwloli', 'nsfwfoot', 'nsfwass', 'nsfwbdsm', 'nsfwcum', 'nsfwero', 'nsfwfemdom', 'nsfwfoot', 'nsfwglass', 'nsfworgy', 'yuri', 'yuri2', 'yaoi', 'yaoi2', 'panties', 'tetas', 'booty', 'ecchi', 'furro', 'hentai', 'trapito', 'imagenlesbians', 'pene', 'porno', 'randomxxx', 'pechos'];
handler.tags = ['nsfw'];
handler.register = false;
handler.group = true;

export default handler;