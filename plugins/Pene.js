let versusData = {} // Guarda el estado por mensaje

// --------------------------
// Comando .versus
// --------------------------
let handler = async (m, { conn }) => {
  const template = generarVersus([], [], [], []) // 3 escuadras + suplentes vacíos
  const sent = await conn.sendMessage(m.chat, { text: template, mentions: [] })

  versusData[sent.key.id] = {
    chat: m.chat,
    escuadra1: [],
    escuadra2: [],
    escuadra3: [],
    suplentes: []
  }
}
handler.command = /^versus$/i
export default handler

// --------------------------
// Función para generar mensaje con diseño nuevo y slots rellenados
// --------------------------
function generarVersus(esc1, esc2, esc3, suplentes) {
  // Helper para formatear una escuadra de 4 jugadores, con un ícono especial para el primero (👑) y el resto (🥷🏻)
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

  // Formatear suplentes (2 slots)
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

  return `    12 𝐕𝐄𝐑𝐒𝐔𝐒 12
    
    𝐇𝐎𝐑𝐀𝐑𝐈𝐎
    🇲🇽 𝐌𝐄𝐗 : 
    🇨🇴 𝐂𝐎𝐋 : 
    𝐂𝐎𝐋𝐎𝐑 𝐃𝐄 𝐑𝐎𝐏𝐀: 

    ¬ 𝐉𝐔𝐆𝐀𝐃𝐎𝐑𝐄𝐒 𝐏𝐑𝐄𝐒𝐄𝐍𝐓𝐄𝐒
    
          𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 1
${formatEscuadra(esc1)}
          
         𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 2
${formatEscuadra(esc2)}
    
         𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 3
${formatEscuadra(esc3)}
    
    ㅤʚ 𝐒𝐔𝐏𝐋𝐄𝐍𝐓𝐄:
${formatSuplentes(suplentes)}`
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

    // Eliminar usuario de todas las listas para evitar duplicados
    data.escuadra1 = data.escuadra1.filter(u => u !== user)
    data.escuadra2 = data.escuadra2.filter(u => u !== user)
    data.escuadra3 = data.escuadra3.filter(u => u !== user)
    data.suplentes = data.suplentes.filter(u => u !== user)

    // Agregar según emoji y espacio disponible
    if (emoji === '❤️') {
      if (data.escuadra1.length < 4) data.escuadra1.push(user)
      else if (data.escuadra2.length < 4) data.escuadra2.push(user)
      else if (data.escuadra3.length < 4) data.escuadra3.push(user)
    } else if (emoji === '👍') {
      if (data.suplentes.length < 2) data.suplentes.push(user)
    } else if (emoji === '👎') {
      // Usuario eliminado de listas arriba, no reingresa
    } else continue

    let nuevoTexto = generarVersus(data.escuadra1, data.escuadra2, data.escuadra3, data.suplentes)
    let mentions = [...data.escuadra1, ...data.escuadra2, ...data.escuadra3, ...data.suplentes]

    // Editar mensaje con el mismo id (no borrar ni crear otro)
    await conn.sendMessage(data.chat, {
      text: nuevoTexto,
      mentions
    }, {
      messageId: msgID
    })

    // No se actualiza la clave en versusData porque el id no cambia
  }
})