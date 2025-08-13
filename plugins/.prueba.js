let handler = async (m, { conn }) => {
    let week = new Date().toLocaleDateString('es', { weekday: 'long' })
    let date = new Date().toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' })

    let menu = `
¡Hola! 👋🏻 @${m.sender.split("@")[0]}

\`\`\`${week}, ${date}\`\`\`

╭──𝗠𝗘𝗡𝗨 𝗛𝗢𝗧──────
│ 𝘉𝘪𝘦𝘯𝘷𝘦𝘯𝘪𝘥𝘰 ...
│ 𝘋𝘢𝘭𝘦 𝘤𝘢𝘳𝘪𝘯̃𝘰 𝘢 𝘵𝘶 𝘨𝘢𝘯𝘻𝘰 
│ 𝘤𝘰𝘯 𝘦𝘭 𝘮𝘦𝘯𝘶 𝘩𝘰𝘵.
╰────────────────

» 𝗗𝗘𝗦𝗖𝗔𝗥𝗚𝗔𝗦 𝗛𝗢𝗧 
│🔥➺ .𝘩𝘰𝘵𝘵𝘪𝘬𝘵𝘰𝘬
│🔥➺ .𝘵𝘦𝘵𝘢𝘴
│🔥➺ .𝘱𝘢𝘤𝘬
│🔥➺ .𝘹𝘷𝘪𝘥𝘦𝘰𝘴
╰━━━━━━⋆★⋆━━━━━━⬣
`.trim()

    const vi = ['https://telegra.ph/file/aa3e11b1cc4246ad72b9b.mp4']

    await conn.sendMessage(m.chat, {
    video: { url: vi[0] },
    caption: menu,
    mentions: [m.sender],
    gifPlayback: true
}, { quoted: m })
}

handler.command = /^menuhot$/i
export default handler