import { promises } from 'fs'
import { join } from 'path'
import fetch from 'node-fetch'
import { xpRange } from '../lib/levelling.js'

let tags = {
  'main': '𝘐𝘯𝘧𝘰 📚',
  'search': '𝘉𝘶𝘴𝘲𝘶𝘦𝘥𝘢𝘴 🔎',
  'game': '𝘑𝘶𝘦𝘨𝘰𝘴 🎮',
  'rpg': '𝘙𝘗𝘎 🌠',
  'rg': '𝘙𝘦𝘨𝘪𝘴𝘵𝘳𝘰 📁',
  'sticker': '𝘚𝘵𝘪𝘤𝘬𝘦𝘳𝘴 🏞',
  'img': '𝘐𝘮𝘢́𝘨𝘦𝘯𝘦𝘴 📸',
  'group': '𝘎𝘳𝘶𝘱𝘰𝘴 👥',
  'logo': '𝘓𝘰𝘨𝘰 - 𝘮𝘢𝘬𝘦𝘳 🎨',
  'nable': '𝘖𝘯 / 𝘖𝘧𝘧 📴', 
  'downloader': '𝘋𝘦𝘴𝘤𝘢𝘳𝘨𝘢𝘴 📥',
  'tools': '𝘏𝘦𝘳𝘳𝘢𝘮𝘪𝘦𝘯𝘵𝘢𝘴 🔧',
  'fun': '𝘋𝘪𝘷𝘦𝘳𝘴𝘪𝘰́𝘯 🎲',
  'nsfw': '𝘕𝘴𝘧𝘸 🔞', 
  'owner': '𝘊𝘳𝘦𝘢𝘥𝘰𝘳 😺', 
  'audio': '𝘈𝘶𝘥𝘪𝘰𝘴 🔉', 
  'advanced': '𝘈𝘷𝘢𝘯𝘻𝘢𝘥𝘰 💠',
  'freefire': '𝘍𝘳𝘦𝘦 𝘍𝘪𝘳𝘦 📌',
  'anime': '𝘈𝘯𝘪𝘮𝘦 🌸',
}

const defaultMenu = {
  before: `
*꒷꒦꒷꒷꒦꒷꒦꒷꒷꒦꒷꒦꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷꒦꒷꒦꒷꒦꒷*
    

🔥 𝗧𝗶𝗲𝗺𝗽𝗼 𝗔𝗰𝘁𝗶𝘃𝗼: *169 Horas*

💻 𝗛𝗼𝘀𝘁𝗶𝗻𝗴 𝗔𝗰𝘁𝘂𝗮𝗹: 𝗦𝗸𝘆 𝘂𝗹𝘁𝗿𝗮 

🕷️ 𝗖𝗿𝗲𝗮𝗱𝗼𝗿: +5215561076182




 %readmore
*~•~•~•~•~•~•~•~•~•~•~•~•~•~•~•~•~*

\t\t\t𝑭𝒍𝒖𝒙𝑩𝒐𝒕
`.trimStart(),
header: '┣━━━ *〔* *%category* *〕*━━━┫',
body: '*┃⋗ 🥃* *%cmd*\n',
footer: '┗━━━━━━━━━━━━━━┛\n',
after: '',
}

let handler = async (m, { conn, usedPrefix: _p, __dirname }) => {
  try {
    let _package = JSON.parse(await promises.readFile(join(__dirname, '../package.json')).catch(_ => ({}))) || {}
    let { exp, limit, level } = global.db.data.users[m.sender]
    let { min, xp, max } = xpRange(level, global.multiplier)
    let name = await conn.getName(m.sender)
    let d = new Date(new Date + 3600000)
    let locale = 'es'
    let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(d)
    let time = d.toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    })
    let _uptime = process.uptime() * 1000
    let _muptime
    if (process.send) {
      process.send('uptime')
      _muptime = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
      }) * 1000
    }
    let muptime = clockString(_muptime)
    let uptime = clockString(_uptime)
    let totalreg = Object.keys(global.db.data.users).length
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
    let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => {
      return {
        help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
        tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
        prefix: 'customPrefix' in plugin,
        limit: plugin.limit,
        premium: plugin.premium,
        enabled: !plugin.disabled,
      }
    })
    for (let plugin of help)
      if (plugin && 'tags' in plugin)
        for (let tag of plugin.tags)
          if (!(tag in tags) && tag) tags[tag] = tag
    conn.menu = conn.menu ? conn.menu : {}
    let before = conn.menu.before || defaultMenu.before
    let header = conn.menu.header || defaultMenu.header
    let body = conn.menu.body || defaultMenu.body
    let footer = conn.menu.footer || defaultMenu.footer
    let after = conn.menu.after || (conn.user.jid == global.conn.user.jid ? '' : ``) + defaultMenu.after
    let _text = [
      before,
      ...Object.keys(tags).map(tag => {
        return header.replace(/%category/g, tags[tag]) + '\n' + [
          ...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
            return menu.help.map(help => {
              return body.replace(/%cmd/g, menu.prefix ? help : '%p' + help)
                .replace(/%islimit/g, menu.limit ? '' : '')
                .replace(/%isPremium/g, menu.premium ? '' : '')
                .trim()
            }).join('\n')
          }),
          footer
        ].join('\n')
      }),
      after
    ].join('\n')
    let text = typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : ''
    let replace = {
      '%': '%',
      p: _p, uptime, muptime,
      taguser: '@' + m.sender.split("@s.whatsapp.net")[0],
      wasp: '@0',
      me: conn.getName(conn.user.jid),
      npmname: _package.name,
      version: _package.version,
      npmdesc: _package.description,
      npmmain: _package.main,
      author: _package.author.name,
      license: _package.license,
      exp: exp - min,
      maxexp: xp,
      totalexp: exp,
      xp4levelup: max - exp,
      github: _package.homepage ? _package.homepage.url || _package.homepage : '[unknown github url]',
      level, limit, name, weton, week, date, dateIslamic, time, totalreg, rtotalreg,
      readmore: readMore
    }
    text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])

    let pp = 'https://cdn.russellxz.click/f6c66c2a.mp4'
    await conn.sendMessage(m.chat, {
  video: { url: 'https://cdn.russellxz.click/f6c66c2a.mp4' },
  caption: text.trim(),
  gifPlayback: true
}, { quoted: m })

  } catch (e) {
    conn.reply(m.chat, 'Lo sentimos, el menú tiene un error.', m)
    throw e
  }
}

handler.customPrefix = /^(menu|menú|ayuda|help)$/i;
handler.command = new RegExp; // para que funcione sin prefijo
handler.register = false;

export default handler;

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
        }