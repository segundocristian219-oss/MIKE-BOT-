// ==========================
// Comando .versus
// ==========================
let versusData = {} // Guardará el estado por mensaje

let handler = async (m, { conn }) => {
  const template = generarVersus([], []) // lista vacía
  const sent = await conn.sendMessage(m.chat, { text: template, mentions: [] })

  // Guardamos la info para ese mensaje
  versusData[sent.key.id] = {
    chat: m.chat,
    escuadra: [],
    suplentes: []
  }
}
handler.command = /^versus$/i
export default handler

// ==========================
// Función para generar texto con diseño exacto
// ==========================
function generarVersus(escuadra, suplentes) {
  let texto = `╭───〔  *4 VS 4* 〕───╮
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
  return texto
}

function formatSlots(arr, total, icon) {
  let out = ''
  for (let i = 0; i < total; i++) {
    if (arr[i]) out += `│ ${icon} @${arr[i].split('@')[0]}\n`
    else out += `│ ${icon} ➤\n`
  }
  return out.trim()
}

// ==========================
// Listener de reacciones
// ==========================
export async function before(m, { conn }) {
  if (!m.reactionMessage) return
  let msgKey = m.key.id
  let data = versusData[msgKey]
  if (!data) return

  let user = m.sender
  let emoji = m.reactionMessage.text

  // Eliminar duplicados de ambas listas
  data.escuadra = data.escuadra.filter(u => u !== user)
  data.suplentes = data.suplentes.filter(u => u !== user)

  if (emoji === '❤️') {
    if (data.escuadra.length < 4) data.escuadra.push(user)
  } else if (emoji === '👍') {
    if (data.suplentes.length < 4) data.suplentes.push(user)
  } else if (emoji === '👎') {
    // ya lo sacamos arriba
  } else return

  // Editar mensaje
  const nuevoTexto = generarVersus(data.escuadra, data.suplentes)
  await conn.sendMessage(data.chat, { 
    text: nuevoTexto, 
    edit: m.key, 
    mentions: [...data.escuadra, ...data.suplentes] 
  })
}