var handler = async (m, { conn }) => {
    try {
        let code = await conn.groupInviteCode(m.chat)
        let groupMeta = await conn.groupMetadata(m.chat)

        await conn.sendMessage(m.chat, {
            groupInviteMessage: {
                groupJid: m.chat,
                inviteCode: code,
                inviteExpiration: Date.now() + 3_600_000, // 1 hora
                groupName: groupMeta.subject,
                caption: groupMeta.subject,
                jpegThumbnail: await conn.getProfilePicture(m.chat).catch(() => null)
            }
        })
    } catch (error) {
        console.error(error)
        conn.reply(m.chat, '⚠ No puedo obtener el enlace, verifica que soy administrador.', m)
    }
}

handler.help = ['link']
handler.tags = ['grupo']
handler.command = /^link$/i
handler.group = true
handler.botAdmin = true

export default handler