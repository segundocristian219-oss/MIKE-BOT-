// ==========================
//  SISTEMA VERSUS 4 VS 4 (ds6/meta compatible)
// ==========================

let versusData = {} // Guarda el estado por mensaje

// --------------------------
// Comando .versus
// --------------------------
let handler = async (m, { conn }) => {
  const template = generarVersus([], []) // lista vacía
  const sent = await conn.sendMessage(m.chat, { text: template, mentions: [] })

  // Guardar estado del versus
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
// Listener de reacciones (ds6/meta)
// --------------------------
conn.ev.on('messages.upsert', async ({ messages }) => {
  for (let msg of messages) {
    if (!msg.message || !msg.message.reactionMessage) continue // Solo reacciones

    let msgID = msg.message.reactionMessage.key.id
    let data = versusData[msgID]
    if (!data) continue // No es un versus activo

    let user = msg.key.participant || msg.key.remoteJid
    let emoji = msg.message.reactionMessage.text

    // Quitar duplicados
    data.escuadra = data.escuadra.filter(u => u !== user)
    data.suplentes = data.suplentes.filter(u => u !== user)

    if (emoji === '❤️') {
      if (data.escuadra.length < 4) data.escuadra.push(user)
    } else if (emoji === '👍') {
      if (data.suplentes.length < 4) data.suplentes.push(user)
    } else if (emoji === '👎') {
      // salir ya hecho
    } else continue

    // Borrar mensaje viejo
    await conn.sendMessage(data.chat, { delete: msg.message.reactionMessage.key })

    // Mandar lista nueva
    let nuevoTexto = generarVersus(data.escuadra, data.suplentes)
    let sent = await conn.sendMessage(data.chat, {
      text: nuevoTexto,
      mentions: [...data.escuadra, ...data.suplentes]
    })

    // Actualizar ID del mensaje en versusData
    delete versusData[msgID]
    versusData[sent.key.id] = data
  }
})