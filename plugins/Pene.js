let versusData = {} // Guarda el estado por mensaje

// Lista de aliases para cada país, en minúsculas sin coma
const aliasesMX = ['mx', 'méxico', 'mexico', 'méx', 'mex']
const aliasesCO = ['co', 'colombia', 'col']

let handler = async (m, { conn, args }) => {
  if (args.length === 0) {
    await conn.sendMessage(m.chat, { text: '𝐓𝐢𝐞𝐧𝐞𝐬 𝐪𝐮𝐞 𝐞𝐬𝐩𝐞𝐜𝐢𝐟𝐢𝐜𝐚𝐫 𝐥𝐚 𝐡𝐨𝐫𝐚 𝐲 𝐞𝐥 𝐩𝐚𝐢́𝐬 𝐞𝐧 𝐥𝐚 𝐪𝐮𝐞 𝐬𝐞 𝐣𝐮𝐠𝐚𝐫𝐚 ❇️' })
    return
  }

  // Buscamos y limpiamos la coma si hay en el último argumento
  let lastArgRaw = args[args.length - 1]
  let lastArg = lastArgRaw.toLowerCase().replace(/,$/, '') // quita coma al final

  // Verificar si el último argumento es un alias válido de país
  let zonaInput = null
  if (aliasesMX.includes(lastArg)) {
    zonaInput = 'mx'
    args.pop()
  } else if (aliasesCO.includes(lastArg)) {
    zonaInput = 'co'
    args.pop()
  } else {
    // No se especificó país válido
    await conn.sendMessage(m.chat, { text: '𝐓𝐢𝐞𝐧𝐞𝐬 𝐪𝐮𝐞 𝐞𝐬𝐩𝐞𝐜𝐢𝐟𝐢𝐜𝐚𝐫 𝐞𝐥 𝐩𝐚𝐢́𝐬 𝐯𝐚́𝐥𝐢𝐝𝐨 𝐞𝐧 𝐞𝐥 𝐜𝐨𝐦𝐚𝐧𝐝𝐨.\nEjemplo: 𝟑 𝐩𝐦 𝐦𝐱, 𝟒 𝐩𝐦 𝐦é𝐱𝐢𝐜𝐨' })
    return
  }

  // Lo que queda en args es la hora: ej ["3", "pm"] o ["16"] etc.
  const timeStr = args.join(' ').toUpperCase().trim()

  // Regex para hora + optional am/pm  
  const match = timeStr.match(/^(\d{1,2})(?:\s*(AM|PM))?$/i)  
  let horaInput = null
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

  if (horaInput === null) {
    await conn.sendMessage(m.chat, { text: '𝐇𝐨𝐫𝐚 𝐢𝐧𝐯𝐚́𝐥𝐢𝐝𝐚. 𝐄𝐣𝐞𝐦𝐩𝐥𝐨𝐬:\n.12vs12 3 pm mx\n.12vs12 16 co' })
    return
  }

  // Función para convertir y formatear horarios para mostrar
  function format12h(h) {
    let ampm = h >= 12 ? 'PM' : 'AM'
    let hour12 = h % 12
    if (hour12 === 0) hour12 = 12
    return `${hour12} ${ampm}`
  }

  // Convertir horas para ambas zonas
  // México UTC-6, Colombia UTC-5 (Colombia +1 respecto a México)
  // Dependiendo de zonaInput, interpretamos horaInput en esa zona y calculamos la otra zona

  let mexHora, colHora

  if (zonaInput === 'mx') {
    mexHora = horaInput
    colHora = (horaInput + 1) % 24
  } else { // zonaInput === 'co'
    colHora = horaInput
    mexHora = (horaInput + 23) % 24 // -1 mod 24
  }

  const mexText = format12h(mexHora)
  const colText = format12h(colHora)

  const template = generarVersus([], [], [], [], mexText, colText)
  const sent = await conn.sendMessage(m.chat, { text: template, mentions: [] })

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
handler.help = ['12vs12']
handler.tags = ['freefire']
handler.command = /^\.?(12vs12|vs12)$/i
handler.group = true
handler.botAdmin = true
export default handler

// Resto del código (generarVersus y listener) igual que antes

// --------------------------
// Función para generar mensaje con diseño nuevo y slots rellenados
// --------------------------
function generarVersus(esc1, esc2, esc3, suplentes, mexText = '  ', colText = '  ') {
  function formatEscuadra(arr) {
    let out = ''
    for (let i = 0; i < 4; i++) {
      if (arr[i]) {
        let icon = i === 0 ? '👑' : '🥷🏻'
        out += `${icon} ┇ @${arr[i].split('@')[0]}\n`
      } else {
        let icon = i === 0 ? '👑' : '🥷🏻'
        out += `${icon} ┇ \n`
      }
    }
    return out.trimEnd()
  }

  function formatSuplentes(arr) {
    let out = ''
    for (let i = 0; i < 2; i++) {
      if (arr[i]) {
        out += `🥷🏻 ┇ @${arr[i].split('@')[0]}\n`
      } else {
        out += `🥷🏻 ┇ \n`
      }
    }
    return out.trimEnd()
  }

  return `*12 𝐕𝐄𝐑𝐒𝐔𝐒 12*


*𝐇𝐎𝐑𝐀𝐑𝐈𝐎𝐒*;  

*🇲🇽 𝐌𝐄𝐗𝐈𝐂𝐎* : ${mexText}  
*🇨🇴 𝐂𝐎𝐋𝐎𝐌𝐁𝐈𝐀* : ${colText}


*𝐉𝐔𝐆𝐀𝐃𝐎𝐑𝐄𝐒 𝐏𝐑𝐄𝐒𝐄𝐍𝐓𝐄𝐒*;

*𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 1*

${formatEscuadra(esc1)}

*𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 2*

${formatEscuadra(esc2)}

*𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 3*

${formatEscuadra(esc3)}

ㅤʚ *𝐒𝐔𝐏𝐋𝐄𝐍𝐓𝐄𝐒*:

${formatSuplentes(suplentes)}

*𝖲𝗈𝗅𝗈 𝗋𝖾𝖺𝖼𝖼𝗂𝗈𝗇𝖺 𝖼𝗈𝗇:*

> 「 ❤️ 」𝖯𝖺𝗋𝗍𝗂𝖼𝗂𝗉𝖺𝗋
> 「 👍 」𝖲𝗎𝗉𝗅𝖾𝗇𝗍𝖾
> 「 👎 」𝖲𝖺𝗅𝗂𝗋 𝖽𝖾 𝗅𝖺 𝗅𝗂𝗌𝗍𝖺`
}

// --------------------------
// Listener de reacciones (ds6/meta)
// --------------------------
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
      // Ya eliminado arriba  
    } else continue  

    let nuevoTexto = generarVersus(data.escuadra1, data.escuadra2, data.escuadra3, data.suplentes, data.mexText, data.colText)  
    let mentions = [...data.escuadra1, ...data.escuadra2, ...data.escuadra3, ...data.suplentes]  

    try {  
      await conn.sendMessage(data.chat, { delete: msg.message.reactionMessage.key })  
    } catch {}  

    let sent = await conn.sendMessage(data.chat, {  
      text: nuevoTexto,  
      mentions  
    })  

    delete versusData[msgID]  
    versusData[sent.key.id] = data
  }
})