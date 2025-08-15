var handler = async (m, { conn }) => {
    try {
        let link = 'https://chat.whatsapp.com/' + await conn.groupInviteCode(m.chat)

        await conn.sendMessage(m.chat, {
            text: link
        }, { quoted: m }) // contesta al mensaje original

    } catch (error) {
        conn.reply(m.chat, '⚠ Error al obtener el enlace del grupo. Asegúrate de que soy admin.', m)
    }
}

handler.help = ['link']
handler.tags = ['grupo']
handler.command = /^link$/i
handler.group = true
handler.botAdmin = true

export default handler