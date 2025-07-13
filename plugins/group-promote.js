const handler = async (m, { conn, text, quoted }) => {
  const u = (text || quoted?.sender)?.replace(/\D/g, '')
  if (!u) return m.reply('🚩 Use el comando correctamente\n\nEjemplo:\n> .promote @usuario', m)

  await conn.groupParticipantsUpdate(m.chat, [u + '@s.whatsapp.net'], 'promote')
  m.reply('🚩 𝘈𝘤𝘤𝘪𝘰́𝘯 𝘳𝘦𝘢𝘭𝘪𝘻𝘢𝘥𝘢')
}

handler.command = /^(promote|daradmin|darpoder)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler