let handler = async (m, { conn }) => {
  await conn.sendMessage(m.chat, {
    buttons: [
      { buttonId: '.owner', buttonText: { displayText: '👤 Owner' }, type: 1 },
      { buttonId: '.menu', buttonText: { displayText: '📜 Menú' }, type: 1 }
    ],
    text: "Menú de botones 👇",
    footer: "DS6 Meta Bot",
    headerType: 1
  }, { quoted: m })
}

handler.command = /^botones$/i
export default handler