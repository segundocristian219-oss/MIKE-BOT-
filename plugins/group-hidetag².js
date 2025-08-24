import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

const handler = async (m, { conn, participants }) => {
  if (!m.isGroup || m.key.fromMe) return

  const content = m.text || m.msg?.caption || ''
  if (!/^.?n(\s|$)/i.test(content.trim())) return

  await conn.sendMessage(m.chat, { react: { text: '📢', key: m.key } })

  const userText = content.trim().replace(/^.?n\s*/i, '')
  const finalText = userText || ''

  try {
    const users = participants.map(u => conn.decodeJid(u.id))
    const q = m.quoted ? m.quoted : m
    const mtype = q.mtype || ''

    const isMedia = ['imageMessage','videoMessage','audioMessage','stickerMessage'].includes(mtype)

    // 📌 Extra: manejar encuestas
    const isPoll = ['pollCreationMessage','pollUpdateMessage'].includes(mtype)

    const originalCaption = (q.msg?.caption || q.text || '').trim()
    const finalCaption = finalText || originalCaption || '📢 Notificación'

    if (m.quoted && isMedia) {
      // ... (lo tuyo igual, no lo toco)
    } else if (m.quoted && isPoll) {
      // ✅ Si citaste una encuesta, la convertimos en texto
      let pollText = q.message?.pollCreationMessage?.name || "📊 Encuesta"
      await conn.sendMessage(m.chat, {
        text: `${finalCaption || pollText}\n\n${'> 𝙱𝙰𝙺𝙸 - 𝙱𝙾𝚃'}`,
        mentions: users
      }, { quoted: m })

    } else if (m.quoted && !isMedia) {
      // ... (igual que ya tenías, para textos normales)
    } else if (!m.quoted && isMedia) {
      // ... (igual que ya tenías)
    } else if (!m.quoted && isPoll) {
      // ✅ Si mandaste directamente una encuesta sin citar nada
      let pollText = q.message?.pollCreationMessage?.name || "📊 Encuesta"
      await conn.sendMessage(m.chat, {
        text: `${finalCaption || pollText}\n\n${'> 𝙱𝙰𝙺𝙸 - 𝙱𝙾𝚃'}`,
        mentions: users
      }, { quoted: m })
    } else {
      await conn.sendMessage(m.chat, {
        text: `${finalCaption}\n\n${'> 𝙱𝙰𝙺𝙸 - 𝙱𝙾𝚃'}`,
        mentions: users
      }, { quoted: m })
    }

  } catch (e) {
    const users = participants.map(u => conn.decodeJid(u.id))
    await conn.sendMessage(m.chat, {
      text: `📢 Notificación\n\n${'> 𝙱𝙰𝙺𝙸 - 𝙱𝙾𝚃'}`,
      mentions: users
    }, { quoted: m })
  }
}

handler.customPrefix = /^(\.n|n)(\s|$)/i
handler.command = new RegExp
handler.group = true
handler.admin = true

export default handler