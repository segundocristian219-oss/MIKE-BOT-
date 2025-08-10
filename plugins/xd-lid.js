let handler = async function (m, { conn }) {
  if (!m.isGroup) return m.reply('❌ Este comando solo funciona en grupos.')

  // Obtenemos datos del grupo directamente
  let groupMetadata
  try {
    groupMetadata = await conn.groupMetadata(m.chat)
  } catch (e) {
    console.error(e)
    return m.reply('⚠️ No pude obtener la información del grupo.')
  }

  const participantes = groupMetadata?.participants || []

  if (!participantes.length) return m.reply('⚠️ No se encontraron participantes en este grupo.')

  const tarjetas = participantes.map((p, index) => {
    const rawJid = p.id || ''
    const [user, domain] = rawJid.split('@')
    const lid = domain === 'lid' ? `${user}@lid` : `${user}@s.whatsapp.net`

    const estado = p.admin === 'superadmin'
      ? '👑 Superadmin'
      : p.admin === 'admin'
        ? '🛡️ Admin'
        : '👤 Miembro'

    return [
      '┆ ┏━━━━━━━━━━━━━━━⌬',
      `┆ ┃ 🧾 *Participante ${index + 1}*`,
      `┆ ┃ 👤 *Usuario:* @${user}`,
      `┆ ┃ 🆔 *LID:* ${lid}`,
      `┆ ┃ 📌 *Estado:* ${estado}`,
      '┆ ┗━━━━━━━━━━━━━━━━━━⌬'
    ].join('\n')
  })

  const salida = [
    '╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄⑆',
    '┆',
    tarjetas.join('\n┆\n'),
    '┆',
    '╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄⑆'
  ].join('\n')

  const mencionados = participantes.map(p => p.id).filter(Boolean)
  return conn.reply(m.chat, salida, m, { mentions: mencionados })
}

handler.command = ['lid']
handler.help = ['lid']
handler.tags = ['group']

export default handler