let handler = async (m, { conn }) => {
  if (!m.quoted) return
  let { remoteJid, fromMe, id, participant } = m.quoted.key

  try {
    await conn.sendMessage(remoteJid, {
      delete: {
        remoteJid,
        fromMe,
        id,
        participant: participant || remoteJid
      }
    })
  } catch (e) {
    console.error('❌ Error eliminando mensaje:', e)
  }
}

handler.command = /^del(ete)?$/i
handler.admin = true
handler.botAdmin = true
handler.group = false // puedes poner true si solo quieres en grupos

export default handler