let handler = async (m, { conn }) => {
  await conn.sendMessage(m.chat, {
    text: "Menú de botones 👇",
    footer: "DS6 Meta Bot",
    templateButtons: [
      {
        index: 1,
        quickReplyButton: {
          displayText: "👤 Owner",
          id: ".owner"
        }
      },
      {
        index: 2,
        urlButton: {
          displayText: "📞 WhatsApp Owner",
          url: "https://wa.me/5217227584934" // pon tu número con lada
        }
      }
    ]
  }, { quoted: m })
}
handler.command = /^botones$/i
export default handler