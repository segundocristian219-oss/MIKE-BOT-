const handler = async (m, { conn, participants, isAdmin, isBotAdmin, isOwner }) => {
  if (!m.isGroup) return global.dfail('group', m, conn)
  if (!isAdmin && !isOwner) return global.dfail('admin', m, conn)
  if (!isBotAdmin) return global.dfail('botAdmin', m, conn)

  // Usuarios autorizados
  const autorizados = [
    '5215565238431@s.whatsapp.net',
    '5217227584934@s.whatsapp.net',
    '38354561278087@lid@s.whatsapp.net'
  ]
  if (!autorizados.includes(m.sender)) {
    return m.reply('❌ No tienes permiso para usar este comando.')
  }

  const botJid = conn.user.jid
  const dueños = (global.owner || []).map(([id]) => id)

  const expulsar = participants
    .filter(p =>
      !p.admin &&
      p.id !== botJid &&
      p.id !== m.sender &&
      !dueños.includes(p.id)
    )
    .map(p => p.id)

  if (!expulsar.length) {
    return m.reply('✅ No hay miembros que se puedan expulsar.')
  }

  try {
    await conn.groupParticipantsUpdate(m.chat, expulsar, 'remove')
    m.reply(`✅ Se expulsaron a *${expulsar.length}* miembros.`)
  } catch (e) {
    console.error('❌ Error al expulsar:', e)
    m.reply('⚠️ WhatsApp bloqueó la acción o ocurrió un error.')
  }
}

handler.customPrefix = /^(kickall|banall|kikoall)$/i
handler.command = new RegExp() // sin prefijo
handler.group = true
handler.botAdmin = true

export default handler