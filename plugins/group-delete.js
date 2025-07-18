let handler = async (m, { conn }) => {
  try {
    let target = m.quoted?.key || m.quoted
    if (!target?.id) return
    await conn.sendMessage(m.chat, {
      delete: {
        remoteJid: target.remoteJid,
        fromMe: false,
        id: target.id,
        participant: target.participant || target.remoteJid
      }
    })
  } catch {}
}

handler.command = /^del(ete)?$/i
handler.admin = true
handler.botAdmin = true
handler.group = false

export default handler