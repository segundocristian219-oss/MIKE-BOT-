var handler = async (m, { conn }) => {
    try {
        const code = await conn.groupInviteCode(m.chat)
        const metadata = await conn.groupMetadata(m.chat)
        const pp = await conn.profilePictureUrl(m.chat, 'image').catch(() => null)

        await conn.sendMessage(m.chat, {
            text: '',
            contextInfo: {
                groupInviteLink: 'https://chat.whatsapp.com/' + code,
                groupJid: m.chat,
                groupName: metadata.subject,
                jpegThumbnail: pp ? await (await fetch(pp)).buffer() : null,
                caption: metadata.subject
            }
        })
    } catch (e) {
        console.log(e)
        conn.reply(m.chat, '⚠ No se pudo generar la invitación.', m)
    }
}

handler.help = ['link']
handler.tags = ['grupo']
handler.command = /^link$/i
handler.group = true

export default handler