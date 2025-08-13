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
│🔥➺ .hottiktok
│🔥➺ .tetas
│🔥➺ .pene
│🔥➺ .pack
│🔥➺ .xvideos
│🔥➺ .hentaipdf
│🔥➺ .xnxxx link
│🔥➺ .xnxxxsearch texto
│🔥➺ .hentaisearch texto
│🔥➺ .pornhubsearch texto
╰━━━━━━⋆★⋆━━━━━━⬣

» 𝗧𝗥𝗜𝗣𝗘 𝗫
│🔞➺ .nsfwloli
│🔞➺ .nsfwfoot
│🔞➺ .nsfwass
│🔞➺ .nsfwbdsm
│🔞➺ .nsfwcum
│🔞➺ .nsfwero
│🔞➺ .nsfwfemdom
│🔞➺ .nsfwfoot
│🔞➺ .nsfwglass
│🔞➺ .nsfworgy
│🔞➺ .yuri
│🔞➺ .yuri2
│🔞➺ .yuri2
│🔞➺ .yaoi
│🔞➺ .yaoi2
│🔞➺ .booty
│🔞➺ .ecchi
│🔞➺ .furro
│🔞➺ .hentai
│🔞➺ .trapito
╰━━━━━━⋆★⋆━━━━━━⬣
`.trim()

    const vi = ['https://telegra.ph/file/aa3e11b1cc4246ad72b9b.mp4']

    await conn.sendMessage(m.chat, {
        video: { url: vi[0] },
        caption: menu,
        mentions: [m.sender]
    }, { quoted: m })
}

handler.command = /^menuhot$/i
export default handler