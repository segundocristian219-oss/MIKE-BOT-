import fetch from 'node-fetch'

var handler = async (m, { conn }) => {
    try {
        // Obtener link y foto
        let link = 'https://chat.whatsapp.com/' + await conn.groupInviteCode(m.chat)
        let ppUrl = await conn.profilePictureUrl(m.chat, 'image').catch(() => null)

        // Mandar la foto del grupo
        if (ppUrl) {
            await conn.sendMessage(m.chat, { image: { url: ppUrl }, caption: link }, { quoted: m })
        } else {
            // Si no hay foto, mandar solo el link con vista previa
            await conn.sendMessage(m.chat, { text: link }, { quoted: m })
        }

    } catch (error) {
        console.error(error)
        conn.reply(m.chat, '⚠ No se pudo obtener el enlace del grupo. Asegúrate de que soy administrador.', m)
    }
}

handler.help = ['link']
handler.tags = ['grupo']
handler.command = /^link$/i
handler.group = true
handler.botAdmin = true

export default handler