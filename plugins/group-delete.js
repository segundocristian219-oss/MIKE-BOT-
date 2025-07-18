let handler = async (m, { conn }) => {
  if (!m.quoted) return
  let { remoteJid, fromMe, id, participant } = m.quoted.key


try {
let delet = m.message.extendedTextMessage.contextInfo.participant
let bang = m.message.extendedTextMessage.contextInfo.stanzaId
return conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet }})
 } catch {
return conn.sendMessage(m.chat, { delete: m.quoted.vM.key })
}
}

handler.command = /^del(ete)?$/i
handler.admin = true
handler.botAdmin = true
handler.group = false // puedes poner true si solo quieres en grupos

export default handler