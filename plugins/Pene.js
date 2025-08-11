// ==========================
//  SISTEMA VERSUS 4 VS 4 (Diseño estilo captura)
// ==========================

let versusData = {} // Guarda el estado por mensaje

// --------------------------
// Comando .versus
// --------------------------
let handler = async (m, { conn }) => {
  const template = generarVersus([], []) // lista vacía
  const sent = await conn.sendMessage(m.chat, { text: template, mentions: [] })

  versusData[sent.key.id] = {
    chat: m.chat,
    escuadra: [],
    suplentes: []
  }
}
handler.command = /^versus$/i
export default handler

// --------------------------
// Función para generar mensaje con diseño nuevo
// --------------------------
function generarVersus(escuadra, suplentes) {
  return `*4 𝗩𝗘𝗥𝗦𝗨𝗦 4*

┌───┤ *MODO:* vv2 ├───
│ ⏰ *HORARIO*
│ • 10:00pm MÉXICO 🇲🇽
│ • 11:00pm COLOMBIA 🇨🇴
│
│ *» ESCUADRA:*
${formatSlots(escuadra, 4, '👑')}
│
│ *» SUPLENTE:*
${formatSlots(suplentes, 4, '♣')}
└────────────────────

*Solo reacciona con :*
│ ❤️ → Participar
│ 👍 → Suplente
│ 👎 → Salir de la lista`
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
    if (!msg.message || !msg.message.reactionMessage) continue

    let msgID = msg.message.reactionMessage.key.id
    let data = versusData[msgID]
    if (!data) continue

    let user = msg.key.participant || msg.key.remoteJid
    let emoji = msg.message.reactionMessage.text

    data.escuadra = data.escuadra.filter(u => u !== user)
    data.suplentes = data.suplentes.filter(u => u !== user)

    if (emoji === '❤️') {
      if (data.escuadra.length < 4) data.escuadra.push(user)
    } else if (emoji === '👍') {
      if (data.suplentes.length < 4) data.suplentes.push(user)
    } else if (emoji === '👎') {
      // salir ya hecho
    } else continue

    await conn.sendMessage(data.chat, { delete: msg.message.reactionMessage.key })

    let nuevoTexto = generarVersus(data.escuadra, data.suplentes)
    let sent = await conn.sendMessage(data.chat, {
      text: nuevoTexto,
      mentions: [...data.escuadra, ...data.suplentes]
    })

    delete versusData[msgID]
    versusData[sent.key.id] = data
  }
})