// ==========================
//  SISTEMA VERSUS 4 VS 4
// ==========================

let versusData = {} // Guardará el estado de cada mensaje

// --------------------------
// Comando .versus
// --------------------------
let handler = async (m, { conn }) => {
  const template = generarVersus([], []) // lista vacía
  const sent = await conn.sendMessage(m.chat, { text: template, mentions: [] })

  // Guardamos info para ese mensaje
  versusData[sent.key.id] = {
    chat: m.chat,
    escuadra: [],
    suplentes: []
  }
}
handler.command = /^versus$/i
export default handler

// --------------------------
// Función para generar mensaje
// --------------------------
function generarVersus(escuadra, suplentes) {
  return `╭───〔  *4 VS 4* 〕───╮
│ *MODO:* vv2
│ ⏰ *HORARIO*
│ • 10:00pm MÉXICO 🇲🇽
│ • 11:00pm COLOMBIA 🇨🇴
│
│ *» ESCUADRA:*
${formatSlots(escuadra, 4, '♛')}
│
│ *» SUPLENTE:*
${formatSlots(suplentes, 4, '♣')}
╰────────────────────╯

❤️ = Escuadra | 👍 = Suplente | 👎 = Salir`
}

function formatSlots(arr, total, icon) {
  let out = ''
  for (let i = 0; i < total; i++) {
    if (arr[i]) out += `│ ${icon} @${arr[i].split('@')[0]}\n`
    else out += `│ ${icon} ➤\n`
  }
  return out.trim()
}

// --------------------------
// Listener de reacciones
// --------------------------
conn.ev.on('messages.update', async updates => {
  for (const update of updates) {
    if (!update.message) continue
    if (!update.message.reactionMessage) continue

    let msgID = update.key.id
    let data = versusData[msgID]
    if (!data) continue

    let user = update.key.participant
    let emoji = update.message.reactionMessage.text

    // Eliminar duplicados
    data.escuadra = data.escuadra.filter(u => u !== user)
    data.suplentes = data.suplentes.filter(u => u !== user)

    if (emoji === '❤️') {
      if (data.escuadra.length < 4) data.escuadra.push(user)
    } else if (emoji === '👍') {
      if (data.suplentes.length < 4) data.suplentes.push(user)
    } else if (emoji === '👎') {
      // ya lo eliminamos arriba
    } else continue

    // Editar el mensaje original
    let nuevoTexto = generarVersus(data.escuadra, data.suplentes)
    await conn.sendMessage(data.chat, {
      text: nuevoTexto,
      edit: { remoteJid: data.chat, id: msgID, fromMe: false },
      mentions: [...data.escuadra, ...data.suplentes]
    })
  }
})