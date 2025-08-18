import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

const handler = async (m, { conn, participants }) => {
  if (!m.isGroup || m.key.fromMe) return // 🛡️ Solo en grupos, no en privados ni en mensajes del bot

  // ✅ Detectar si empieza con "n" o ".n"
  const content = m.text || m.msg?.caption || ''
  if (!/^\.?n(\s|$)/i.test(content.trim())) return

  // ✅ Reacción 📢
  await conn.sendMessage(m.chat, { react: { text: '📢', key: m.key } })

  // ✅ Extraer el texto después del comando (.n o n)
  const userText = content.trim().replace(/^\.?n\s*/i, '') 
  const finalText = userText || '' 

  try {
    const users = participants.map(u => conn.decodeJid(u.id))
    const q = m.quoted ? m.quoted : m
    const mtype = q.mtype || '' 

    // ✅ Detectar si es media
    const isMedia = ['imageMessage','videoMessage','audioMessage','stickerMessage'].includes(mtype)

    const originalCaption = (q.msg?.caption || q.text || '').trim()
    const finalCaption = finalText || originalCaption || '📢 Notificación'

    if (m.quoted && isMedia) {
      if (mtype === 'audioMessage') {
        try {
          const media = await q.download() // ⏳ Intentar descargar
          await conn.sendMessage(m.chat, { 
            audio: media, 
            mimetype: 'audio/ogg; codecs=opus', 
            ptt: true, 
            mentions: users 
          }, { quoted: m })
          await conn.sendMessage(m.chat, { text: finalCaption, mentions: users }, { quoted: m })
        } catch {
          // ⚠️ Plan B: solo texto
          await conn.sendMessage(m.chat, { text: finalCaption, mentions: users }, { quoted: m })
        }
      } else {
        const media = await q.download()
        if (mtype === 'imageMessage') {
          await conn.sendMessage(m.chat, { image: media, caption: finalCaption, mentions: users }, { quoted: m })
        } else if (mtype === 'videoMessage') {
          await conn.sendMessage(m.chat, { video: media, caption: finalCaption, mentions: users, mimetype: 'video/mp4' }, { quoted: m })
        } else if (mtype === 'stickerMessage') {
          await conn.sendMessage(m.chat, { sticker: media, mentions: users }, { quoted: m })
        }
      }

    } else if (m.quoted && !isMedia) {
      // Texto citado
      const msg = conn.cMod(
        m.chat,
        generateWAMessageFromContent(
          m.chat,
          { [mtype || 'extendedTextMessage']: q.message?.[mtype] || { text: finalCaption } },
          { quoted: m, userJid: conn.user.id }
        ),
        finalCaption,
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
          await conn.sendMessage(m.chat, { text: finalCaption, mentions: users }, { quoted: m })
        } catch {
          // ⚠️ Plan B: solo texto
          await conn.sendMessage(m.chat, { text: finalCaption, mentions: users }, { quoted: m })
        }
      } else {
        const media = await m.download()
        if (mtype === 'imageMessage') {
          await conn.sendMessage(m.chat, { image: media, caption: finalCaption, mentions: users }, { quoted: m })
        } else if (mtype === 'videoMessage') {
          await conn.sendMessage(m.chat, { video: media, caption: finalCaption, mentions: users, mimetype: 'video/mp4' }, { quoted: m })
        } else if (mtype === 'stickerMessage') {
          await conn.sendMessage(m.chat, { sticker: media, mentions: users }, { quoted: m })
        }
      }

    } else {
      // ✅ Texto normal
      await conn.sendMessage(m.chat, {
        text: finalCaption,
        mentions: users
      }, { quoted: m })
    }

  } catch (e) {
    const users = participants.map(u => conn.decodeJid(u.id))
    await conn.sendMessage(m.chat, {
      text: '📢 Notificación',
      mentions: users
    }, { quoted: m })
  }
}

handler.customPrefix = /^\.?n(\s|$)/i
handler.command = new RegExp
handler.group = true
handler.admin = true

export default handler