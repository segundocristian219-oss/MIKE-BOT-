import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

const handler = async (m, { conn, participants }) => {
  if (!m.isGroup || m.key.fromMe) return

  const content = m.text || m.msg?.caption || ''
  if (!/^\.?n(\s|$)/i.test(content.trim())) return

  await conn.sendMessage(m.chat, { react: { text: '📢', key: m.key } })

  const userText = content.trim().replace(/^\.?n\s*/i, '') 
  const finalText = userText || '' 
  const users = participants.map(u => conn.decodeJid(u.id))

  try {
    const q = m.quoted ? m.quoted : m
    const mtype = q.mtype || '' 
    const isMedia = ['imageMessage','videoMessage','audioMessage','stickerMessage'].includes(mtype)
    const originalCaption = (q.msg?.caption || q.text || '').trim()
    const finalCaption = finalText || originalCaption || '📢 Notificación'

    const sendWithPreview = async (text) => {
      const msg = generateWAMessageFromContent(
        m.chat,
        {
          extendedTextMessage: {
            text,
            contextInfo: { 
              externalAdReply: {
                title: "📢 Notificación",
                body: "Enviado por el bot",
                sourceUrl: text,
                mediaType: 1,
                renderLargerThumbnail: true
              }
            }
          }
        },
        { userJid: conn.user.id }
      )
      await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
    }

    if (m.quoted && isMedia) {
      const media = await q.download()
      if (mtype === 'imageMessage') {
        await conn.sendMessage(m.chat, { image: media, caption: `${finalCaption}\n\n${'> 𝐛𝐮𝐮 𝐛𝐨𝐭 🔮'}`, mentions: users }, { quoted: m })
      } else if (mtype === 'videoMessage') {
        await conn.sendMessage(m.chat, { video: media, caption: `${finalCaption}\n\n${'> 𝐛𝐮𝐮 𝐛𝐨𝐭 🔮'}`, mentions: users }, { quoted: m })
      } else if (mtype === 'stickerMessage') {
        await conn.sendMessage(m.chat, { sticker: media, mentions: users }, { quoted: m })
      } else if (mtype === 'audioMessage') {
        await conn.sendMessage(m.chat, { audio: media, mimetype: 'audio/ogg; codecs=opus', ptt: true, mentions: users }, { quoted: m })
      }
    } else {
      if (/https?:\/\//i.test(finalCaption)) {
        await sendWithPreview(finalCaption)
      } else {
        await conn.sendMessage(m.chat, {
          text: `${finalCaption}\n\n${'> 𝐛𝐮𝐮 𝐛𝐨𝐭 🔮'}`,
          mentions: users
        }, { quoted: m })
      }
    }

  } catch (e) {
    await conn.sendMessage(m.chat, {
      text: `📢 Notificación\n\n${'> 𝐛𝐮𝐮 𝐛𝐨𝐭 🔮'}`,
      mentions: participants.map(u => conn.decodeJid(u.id))
    }, { quoted: m })
  }
}

handler.customPrefix = /^\.?n(\s|$)/i
handler.command = new RegExp
handler.group = true
handler.admin = true

export default handler