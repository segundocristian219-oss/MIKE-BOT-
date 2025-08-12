let versusData = {} // Guarda el estado por mensaje

let handler = async (m, { conn, args }) => {
  let horaInput = null
  let zonaInput = null

  if (args.length > 0) {
    const lastArg = args[args.length - 1].toLowerCase()
    if (lastArg === 'mx' || lastArg === 'co') {
      zonaInput = lastArg
      args.pop()
    }

    const timeStr = args.join(' ').toUpperCase().trim()
    const match = timeStr.match(/^(\d{1,2})(?:\s*(AM|PM))?$/i)
    if (match) {
      let hour = parseInt(match[1])
      const ampm = match[2] || null
      if (ampm) {
        if (ampm === 'PM' && hour < 12) hour += 12
        if (ampm === 'AM' && hour === 12) hour = 0
      }
      if (hour >= 0 && hour <= 23) {
        horaInput = hour
      }
    }
  }

  if (!zonaInput) zonaInput = 'mx'

  function format12h(h) {
    let ampm = h >= 12 ? 'PM' : 'AM'
    let hour12 = h % 12
    if (hour12 === 0) hour12 = 12
    return `${hour12} ${ampm}`
  }

  let mexHora, colHora
  if (horaInput === null) {
    mexHora = '  '
    colHora = '  '
  } else if (zonaInput === 'mx') {
    mexHora = horaInput
    colHora = (horaInput + 1) % 24
  } else {
    colHora = horaInput
    mexHora = (horaInput + 23) % 24
  }

  const mexText = (horaInput === null) ? '  ' : format12h(mexHora)
  const colText = (horaInput === null) ? '  ' : format12h(colHora)

  const template = generarVersus([], [], [], [], mexText, colText)
  const sent = await conn.sendMessage(m.chat, { 
    image: { url: 'https://files.catbox.moe/xbtkwq.jpg' },
    caption: template,
    mentions: []
  })

  versusData[sent.key.id] = {
    chat: m.chat,
    escuadra1: [],
    escuadra2: [],
    escuadra3: [],
    suplentes: [],
    mexText,
    colText
  }
}
handler.command = /^versus$/i
export default handler

function generarVersus(esc1, esc2, esc3, suplentes, mexText = '  ', colText = '  ') {
  function formatEscuadra(arr) {
    let out = ''
    for (let i = 0; i < 4; i++) {
      let icon = i === 0 ? '👑' : '🥷🏻'
      out += `${icon} ┇ ${arr[i] ? '@' + arr[i].split('@')[0] : ''}\n`
    }
    return out.trimEnd()
  }
  function formatSuplentes(arr) {
    let out = ''
    for (let i = 0; i < 2; i++) {
      out += `🥷🏻 ┇ ${arr[i] ? '@' + arr[i].split('@')[0] : ''}\n`
    }
    return out.trimEnd()
  }

  return `           12 𝐕𝐄𝐑𝐒𝐔𝐒 12
    
                𝐇𝐎𝐑𝐀𝐑𝐈𝐎S;
            🇲🇽 𝐌𝐄𝐗 : ${mexText}
            🇨🇴 𝐂𝐎𝐋 : ${colText}

 ¬ 𝐉𝐔𝐆𝐀𝐃𝐎𝐑𝐄𝐒 𝐏𝐑𝐄𝐒𝐄𝐍𝐓𝐄𝐒
    
          𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 1
${formatEscuadra(esc1)}
          
         𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 2
${formatEscuadra(esc2)}
    
         𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 3
${formatEscuadra(esc3)}
    
    ㅤʚ 𝐒𝐔𝐏𝐋𝐄𝐍𝐓𝐄:
${formatSuplentes(suplentes)}


*𝖲𝗈𝗅𝗈 𝗋𝖾𝖺𝖼𝖼𝗂𝗈𝗇𝖺 𝖼𝗈𝗇:*
> 「 ❤️ 」𝖯𝖺𝗋𝗍𝗂𝖼𝗂𝗉𝖺𝗋
> 「 👍 」𝖲𝗎𝗉𝗅𝖾𝗇𝗍𝖾
> 「 👎 」𝖲𝖺𝗅𝗂𝗋 𝖽𝖾 𝗅𝖺 𝗅𝗂𝗌𝗍𝖺`
}

conn.ev.on('messages.upsert', async ({ messages }) => {
  for (let msg of messages) {
    if (!msg.message || !msg.message.reactionMessage) continue

    let msgID = msg.message.reactionMessage.key.id
    let data = versusData[msgID]
    if (!data) continue

    let user = msg.key.participant || msg.key.remoteJid
    let emoji = msg.message.reactionMessage.text

    data.escuadra1 = data.escuadra1.filter(u => u !== user)
    data.escuadra2 = data.escuadra2.filter(u => u !== user)
    data.escuadra3 = data.escuadra3.filter(u => u !== user)
    data.suplentes = data.suplentes.filter(u => u !== user)

    if (emoji === '❤️') {
      if (data.escuadra1.length < 4) data.escuadra1.push(user)
      else if (data.escuadra2.length < 4) data.escuadra2.push(user)
      else if (data.escuadra3.length < 4) data.escuadra3.push(user)
    } else if (emoji === '👍') {
      if (data.suplentes.length < 2) data.suplentes.push(user)
    } else if (emoji === '👎') {
    } else continue

    let nuevoTexto = generarVersus(data.escuadra1, data.escuadra2, data.escuadra3, data.suplentes, data.mexText, data.colText)
    let mentions = [...data.escuadra1, ...data.escuadra2, ...data.escuadra3, ...data.suplentes]

    try {
      await conn.sendMessage(data.chat, { delete: msg.message.reactionMessage.key })
    } catch {}

    let sent = await conn.sendMessage(data.chat, {
      image: { url: 'https://files.catbox.moe/xbtkwq.jpg' },
      caption: nuevoTexto,
      mentions
    })

    delete versusData[msgID]
    versusData[sent.key.id] = data
  }
})