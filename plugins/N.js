import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

let handler = async (m, { conn }) => {
  const msg = generateWAMessageFromContent(m.chat, {
    templateMessage: {
      hydratedTemplate: {
        hydratedContentText: "Menú de botones 👇",
        hydratedFooterText: "DS6 Meta Bot",
        hydratedButtons: [
          {
            quickReplyButton: {
              displayText: "👤 Owner",
              id: ".owner"
            }
          },
          {
            urlButton: {
              displayText: "📞 WhatsApp Owner",
              url: "https://wa.me/521XXXXXXXXXX" // pon tu número
            }
          }
        ]
      }
    }
  }, { quoted: m })

  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
}

handler.command = /^botones$/i
export default handler