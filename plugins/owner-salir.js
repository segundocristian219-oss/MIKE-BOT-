let handler = async (m, { conn, text, command }) => {
let id = text ? text : m.chat  
let pp = 'https://cdn.russellxz.click/b8394812.mp4'
await conn.sendMessage(m.chat, { video: { url: pp }, gifPlayback: true, caption: '*Adios a todos, el Bot se despide! 𝑭𝒂𝒃𝒙𝑺𝒂𝒊', mentions: [m.sender] }, { quoted: m })
await conn.groupLeave(id)}
handler.help = ['salir']
handler.tags = ['owner']
handler.command = /^(salir|out|leavegc|leave|salirdelgrupo)$/i
handler.group = true
handler.rowner = true

export default handler
