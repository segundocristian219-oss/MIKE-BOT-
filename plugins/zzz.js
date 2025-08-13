import axios from 'axios';
import fetch from 'node-fetch';

const handler = async (m, { command, conn }) => {
  // Validación segura de modohorny
  const chatSettings = db?.data?.chats?.[m.chat] || {};
  if (!chatSettings.modohorny && m.isGroup) 
    throw '⚠ 𝐋𝐎𝐒 𝐂𝐎𝐌𝐀𝐍𝐃𝐎𝐒 +18 𝐄𝐒𝐓𝐀𝐍 𝐃𝐄𝐒𝐀𝐂𝐓𝐈𝐕𝐀𝐃𝐎𝐒 𝐄𝐍 𝐄𝐒𝐓𝐄 𝐆𝐑𝐔𝐏𝐎.\nSi eres admin y deseas activarlos, usa .on modohorny';

  // Función genérica para enviar imágenes desde JSON
  const sendRandomFromJSON = async (urlJSON, caption) => {
    const res = (await axios.get(urlJSON)).data;
    const url = res[Math.floor(Math.random() * res.length)];
    await conn.sendMessage(m.chat, { image: { url }, caption: `_${caption}_` }, { quoted: m });
  };

  // Comandos simples que solo necesitan JSON
  const simpleJSONCommands = {
    nsfwloli: 'https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/nsfwloli.json',
    nsfwfoot: 'https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/nsfwfoot.json',
    nsfwass: 'https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/nsfwass.json',
    nsfwbdsm: 'https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/nsfwbdsm.json',
    nsfwcum: 'https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/nsfwcum.json',
    nsfwero: 'https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/nsfwero.json',
    nsfwfemdom: 'https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/nsfwfemdom.json',
    nsfwglass: 'https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/nsfwglass.json',
    hentai: 'https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/hentai.json',
    nsfworgy: 'https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/nsfworgy.json',
    ecchi: 'https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/ecchi.json',
    furro: 'https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/furro.json',
    yuri: 'https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/yuri.json',
    panties: 'https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/panties.json',
    porno: 'https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/porno.json',
    pechos: 'https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/pechos.json'
  };

  if (simpleJSONCommands[command]) {
    return sendRandomFromJSON(simpleJSONCommands[command], command);
  }

  // Comandos con API externa y fallback
  if (command === 'tetas') {
    const fallback = (await axios.get(simpleJSONCommands.pechos)).data;
    let res;
    try {
      res = await conn.getFile('https://api-fgmods.ddns.net/api/nsfw/boobs?apikey=fg-dylux');
      res = res?.data || fallback[Math.floor(Math.random() * fallback.length)];
    } catch {
      res = fallback[Math.floor(Math.random() * fallback.length)];
    }
    return conn.sendMessage(m.chat, { image: { url: res }, caption: `_${command}_` }, { quoted: m });
  }

  if (command === 'booty') {
    const fallback = (await axios.get(simpleJSONCommands.nsfwass)).data;
    let res;
    try {
      res = await conn.getFile('https://api-fgmods.ddns.net/api/nsfw/ass?apikey=fg-dylux');
      res = res?.data || fallback[Math.floor(Math.random() * fallback.length)];
    } catch {
      res = fallback[Math.floor(Math.random() * fallback.length)];
    }
    return conn.sendMessage(m.chat, { image: { url: res }, caption: `_${command}_` }, { quoted: m });
  }

  // Comandos fetch
  const fetchCommands = {
    trapito: 'https://api.waifu.pics/nsfw/trap',
    yaoi: 'https://nekobot.xyz/api/image?type=yaoi',
    yaoi2: 'https://purrbot.site/api/img/nsfw/yaoi/gif',
    yuri2: 'https://purrbot.site/api/img/nsfw/yuri/gif'
  };

  if (fetchCommands[command]) {
    const res = await fetch(fetchCommands[command]);
    const json = await res.json();
    const url = json.url || json.link || json.message;
    return conn.sendMessage(m.chat, { image: { url }, caption: `_${command}_` }, { quoted: m });
  }

  // randomxxx
  if (command === 'randomxxx') {
    const sources = [
      simpleJSONCommands.pechos,
      simpleJSONCommands.nsfwass,
      'https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/JSON/imagenlesbians.json',
      simpleJSONCommands.panties,
      simpleJSONCommands.porno
    ];
    const res = (await axios.get(sources[Math.floor(Math.random() * sources.length)])).data;
    const url = res[Math.floor(Math.random() * res.length)];
    return conn.sendMessage(m.chat, { image: { url }, caption: `_${command}_` }, { quoted: m });
  }
};

// Asignamos para que no sea undefined
handler.simpleJSONCommands = {
  nsfwloli: '',
  nsfwfoot: '',
  nsfwass: '',
  nsfwbdsm: '',
  nsfwcum: '',
  nsfwero: '',
  nsfwfemdom: '',
  nsfwglass: '',
  hentai: '',
  nsfworgy: '',
  ecchi: '',
  furro: '',
  yuri: '',
  panties: '',
  porno: '',
  pechos: ''
};
handler.help = Object.keys(handler.simpleJSONCommands).concat(['tetas', 'booty', 'trapito', 'yaoi', 'yaoi2', 'yuri2', 'randomxxx']);
handler.command = handler.help;
handler.tags = ['nsfw'];
handler.register = false;
handler.group = true;

export default handler;