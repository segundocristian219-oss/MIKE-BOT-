import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

const handler = async (m, { conn, participants }) => {
  if (!m.isGroup || m.key.fromMe) return // 🛡️ No se ejecuta en privados ni por el bot

  // ✅ Detectar si empieza con "n" o ".n"
  const content = m.text || m.msg?.caption || ''
  if (!/^\.?n(\s|$)/i.test(content.trim())) return

  // ✅ Extraer el texto después del comando (.n o n)
  const userText = content.trim().replace(/^\.?n\s*/i, '') // elimina .n o n al inicio
  if (!userText) return // si no hay texto, no hace nada

  try {
    const users = participants.map(u => conn.decodeJid(u.id))
    const q = m.quoted ? m.quoted : m
    const mime = (q.msg || q).mimetype || ''
    const isMedia = /image|video|sticker|audio/.test(mime)

    const originalCaption = (q.msg?.caption || q.text || '').trim()
    const finalCaption = userText || originalCaption || '📢 Notificación'

    if (m.quoted && isMedia) {
      // Reenviar media citada
      const media = await q.download()
      if (q.mtype === 'imageMessage') {
        await conn.sendMessage(m.chat, { image: media, caption: finalCaption, mentions: users }, { quoted: m })
      } else if (q.mtype === 'videoMessage') {
        await conn.sendMessage(m.chat, { video: media, caption: finalCaption, mentions: users, mimetype: 'video/mp4' }, { quoted: m })
      } else if (q.mtype === 'audioMessage') {
        await conn.sendMessage(m.chat, { audio: media, mimetype: 'audio/mpeg', fileName: 'audio.mp3', mentions: users }, { quoted: m })
      } else if (q.mtype === 'stickerMessage') {
        await conn.sendMessage(m.chat, { sticker: media, mentions: users }, { quoted: m })
      }

    } else if (m.quoted && !isMedia) {
      // Texto citado
      const msg = conn.cMod(
        m.chat,
        generateWAMessageFromContent(
          m.chat,
          { [q.mtype || 'extendedTextMessage']: q.message?.[q.mtype] || { text: finalCaption } },
          { quoted: m, userJid: conn.user.id }
        ),
        finalCaption,
        conn.user.jid,
        { mentions: users }
      )
      await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })

    } else if (!m.quoted && isMedia) {
      // Mensaje propio con imagen/video + caption
      const media = await m.download()
      if (q.mtype === 'imageMessage') {
        await conn.sendMessage(m.chat, { image: media, caption: finalCaption, mentions: users }, { quoted: m })
      } else if (q.mtype === 'videoMessage') {
        await conn.sendMessage(m.chat, { video: media, caption: finalCaption, mentions: users, mimetype: 'video/mp4' }, { quoted: m })
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