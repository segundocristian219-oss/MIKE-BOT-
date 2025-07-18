let handler = (m, { conn }) => {
  const k = m.quoted?.key
  if (!k) return
  conn.relayMessage(m.chat, { delete: k }, { messageId: k.id })
  conn.relayMessage(m.chat, { delete: m.key }, { messageId: m.key.id })
}

handler.command = /^del(ete)?$/i
handler.tags = ['group']
handler.help = ['del']
handler.admin = true
handler.botAdmin = true
handler.group = false

export default handler