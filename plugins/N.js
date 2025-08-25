let handler = async (m, { conn }) => {
  await conn.sendMessage(m.chat, {
    text: "Contacto del Owner 👑",
    footer: "DS6 Meta Bot",
    buttons: [
      { buttonId: ".owner", buttonText: { displayText: "👤 Owner" }, type: 1 }
    ],
    headerType: 1
  }, { quoted: m })
}
handler.command = /^botones$/i
export default handler