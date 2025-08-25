let handler = async (m, { conn }) => {
  await conn.sendMessage(m.chat, {
    text: "Contacto del Owner 👑",
    footer: "DS6 Meta Bot",
    templateButtons: [
      {
        index: 1,
        urlButton: {
          displayText: "📞 Owner",
          url: "https://wa.me/521XXXXXXXXXX" // pon tu número con lada
        }
      }
    ]
  }, { quoted: m })
}
handler.command = /^botones$/i
export default handler