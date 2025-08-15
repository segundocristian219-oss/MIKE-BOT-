import fetch from 'node-fetch'

var handler = async (m, { conn }) => {
    try {
        let link = '🔗 https://chat.whatsapp.com/' + await conn.groupInviteCode(m.chat)
        let ppUrl = await conn.profilePictureUrl(m.chat, 'image').catch(() => null)

        if (ppUrl) {
            await conn.sendMessage(m.chat, { image: { url: ppUrl }, caption: link }, { quoted: m })
        } else {
            await conn.sendMessage(m.chat, { text: link }, { quoted: m })
        }

    } catch (error) {
        console.error(error)
        conn.reply(m.chat, '⚠ No se pudo obtener el enlace del grupo. Asegúrate de que soy administrador.', m)
    }
}

// Solo activará si el mensaje es exactamente ".link" o "link"
handler.customPrefix = /^(\.link|link)$/i
handler.command = new RegExp
handler.group = true
handler.admin = true

export default handler