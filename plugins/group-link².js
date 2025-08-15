let handler = async (m, { conn, args }) => {
let group = m.chat
let link = 'https://chat.whatsapp.com/' + await conn.groupInviteCode(group)
conn.reply(m.chat, link, m, {detectLink: true})
//conn.sendMessage(m.chat, { text: link }, { quoted: m, detectLink: true })
}
handler.customPrefix = /^(link|.link)/i;
handler.command = new RegExp;
handler.group = true;
handler.admin = true;
export default handler