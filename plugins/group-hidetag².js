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

    // 📊 Nuevo: detectar encuestas
    const isPoll = ['pollCreationMessage','pollUpdateMessage'].includes(mtype)

    const originalCaption = (q.msg?.caption || q.text || '').trim()
    const finalCaption = finalText || originalCaption || '📢 Notificación'

    // ✅ Caso nuevo: si es encuesta
    if (m.quoted && isPoll) {
      let pollText = q.message?.pollCreationMessage?.name || "📊 Encuesta"
      await conn.sendMessage(m.chat, {
        text: `${finalCaption || pollText}\n\n${'> 𝙱𝙰𝙺𝙸 - 𝙱𝙾𝚃'}`,
        mentions: users
      }, { quoted: m })
      return
    }

    // 🔽 De aquí para abajo tu lógica original (NO la moví)

    if (m.quoted && isMedia) {
      if (mtype === 'audioMessage') {
        try {
          const media = await q.download()
          await conn.sendMessage(m.chat, { 
            audio: media, 
            mimetype: 'audio/ogg; codecs=opus', 
            ptt: true, 
            mentions: users 
          }, { quoted: m })

          if (finalText) {
            await conn.sendMessage(m.chat, { 
              text: `${finalText}\n\n${'> 𝙱𝙰𝙺𝙸 - 𝙱𝙾𝚃'}`, 
              mentions: users 
            }, { quoted: m })
          }
        } catch {
          await conn.sendMessage(m.chat, { 
            text: `${finalCaption}\n\n${'> 𝙱𝙰𝙺𝙸 - 𝙱𝙾𝚃'}`, 
            mentions: users 
          }, { quoted: m })
        }
      } else {
        const media = await q.download()
        if (mtype === 'imageMessage') {
          await conn.sendMessage(m.chat, { image: media, caption: `${finalCaption}\n\n${'> 𝙱𝙰𝙺𝙸 - 𝙱𝙾𝚃'}`, mentions: users }, { quoted: m })
        } else if (mtype === 'videoMessage') {
          await conn.sendMessage(m.chat, { video: media, caption: `${finalCaption}\n\n${'> 𝙱𝙰𝙺𝙸 - 𝙱𝙾𝚃'}`, mentions: users, mimetype: 'video/mp4' }, { quoted: m })
        } else if (mtype === 'stickerMessage') {
          await conn.sendMessage(m.chat, { sticker: media, mentions: users }, { quoted: m })
        }
      }

    } else if (m.quoted && !isMedia) {
      const msg = conn.cMod(
        m.chat,
        generateWAMessageFromContent(
          m.chat,
          { [mtype || 'extendedTextMessage']: q.message?.[mtype] || { text: finalCaption } },
          { quoted: m, userJid: conn.user.id }
        ),
        `${finalCaption}\n\n${'> 𝙱𝙰𝙺𝙸 - 𝙱𝙾𝚃'}`,
        conn.user.jid,
        { mentions: users }
      )
      await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })

    } else if (!m.quoted && isMedia) {
      if (mtype === 'audioMessage') {
        try {
          const media = await m.download()
          await conn.sendMessage(m.chat, { 
            audio: media, 
            mimetype: 'audio/ogg; codecs=opus', 
            ptt: true, 
            mentions: users 
          }, { quoted: m })

          if (finalText) {
            await conn.sendMessage(m.chat, { 
              text: `${finalText}\n\n${'> 𝙱𝙰𝙺𝙸 - 𝙱𝙾𝚃'}`, 
              mentions: users 
            }, { quoted: m })
          }
        } catch {
          await conn.sendMessage(m.chat, { 
            text: `${finalCaption}\n\n${'> 𝙱𝙰𝙺𝙸 - 𝙱𝙾𝚃'}`, 
            mentions: users 
          }, { quoted: m })
        }
      } else {
        const media = await m.download()
        if (mtype === 'imageMessage') {
          await conn.sendMessage(m.chat, { image: media, caption: `${finalCaption}\n\n${'> 𝙱𝙰𝙺𝙸 - 𝙱𝙾𝚃'}`, mentions: users }, { quoted: m })
        } else if (mtype === 'videoMessage') {
          await conn.sendMessage(m.chat, { video: media, caption: `${finalCaption}\n\n${'> 𝙱𝙰𝙺𝙸 - 𝙱𝙾𝚃'}`, mentions: users, mimetype: 'video/mp4' }, { quoted: m })
        } else if (mtype === 'stickerMessage') {
          await conn.sendMessage(m.chat, { sticker: media, mentions: users }, { quoted: m })
        }
      }

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