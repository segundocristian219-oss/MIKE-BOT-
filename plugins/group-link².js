import { generateWAMessageFromContent } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

var handler = async (m, { conn }) => {
    try {
        let code = await conn.groupInviteCode(m.chat)
        let metadata = await conn.groupMetadata(m.chat)
        let ppUrl = await conn.profilePictureUrl(m.chat, 'image').catch(() => null)
        let pp = ppUrl ? await (await fetch(ppUrl)).buffer() : null

        let msg = generateWAMessageFromContent(m.chat, {
            groupInviteMessage: {
                groupJid: m.chat,
                inviteCode: code,
                inviteExpiration: Date.now() + 3_600_000, // 1 hora
                groupName: metadata.subject,
                jpegThumbnail: pp,
                caption: metadata.subject
            }
        }, { userJid: m.sender })

        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })

    } catch (e) {
        console.error(e)
        conn.reply(m.chat, '⚠ No se pudo generar el enlace con vista previa.', m)
    }
}

handler.help = ['link']
handler.tags = ['grupo']
handler.command = /^link$/i
handler.group = true
handler.botAdmin = true // si quieres que solo funcione siendo admin

export default handler