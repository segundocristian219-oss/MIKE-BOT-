var handler = async (m, { conn, command, text }) => {
  if (!text) {
    throw `🍭 𝙀𝙎𝘾𝙍𝙄𝘽𝙀 𝙀𝙇 𝙉𝙊𝙈𝘽𝙍𝙀 𝘿𝙀 𝘿𝙊𝙎 𝙋𝙀𝙍𝙎𝙊𝙉𝘼𝙎 𝙊 𝙀𝙏𝙄𝙌𝙐𝙀𝙏𝘼𝙇𝙊𝙎 𝙋𝘼𝙍𝘼 𝘾𝘼𝙇𝘾𝙐𝙇𝘼𝙍 𝙎𝙐 𝘼𝙈𝙊𝙍.`
  }

  // Tomamos el primer nombre y el resto como segundo
  let [text1, ...rest] = text.split(' ')
  let text2 = rest.join(' ')

  if (!text2) {
    throw `🍭 𝙀𝙎𝘾𝙍𝙄𝘽𝙀 𝙊 𝙀𝙏𝙄𝙌𝙐𝙀𝙏𝘼 𝙀𝙇 𝙉𝙊𝙈𝘽𝙍𝙀 𝘿𝙀 𝙇𝘼 𝙎𝙀𝙂𝙐𝙉𝘿𝘼 𝙋𝙀𝙍𝙎𝙊𝙉𝘼.`
  }

  let porcentaje = Math.floor(Math.random() * 100)

  let love = `
━━━━━━━━━━━━━━━
❤️ *${text1}* 𝙏𝙐 𝙊𝙋𝙊𝙍𝙏𝙐𝙉𝙄𝘿𝘼𝘿 𝘿𝙀 𝙀𝙉𝘼𝙈𝙊𝙍𝘼𝙍𝙏𝙀 𝘿𝙀 *${text2}* 𝙀𝙎 𝘿𝙀 *${porcentaje}%* 👩🏻‍❤️‍👨🏻 
━━━━━━━━━━━━━━━
`.trim()

  await conn.sendMessage(m.chat, { 
    text: love, 
    mentions: conn.parseMention(love) 
  }, { quoted: m })
}

handler.help = ['love', 'ship']
handler.tags = ['fun']
handler.command = /^(enamorar|ship)$/i

export default handler