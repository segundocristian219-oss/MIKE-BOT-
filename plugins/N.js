import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'

let handler = async (m, { conn }) => {
  const template = generateWAMessageFromContent(m.chat, proto.Message.fromObject({
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
              url: "https://wa.me/521XXXXXXXXXX"
            }
          }
        ]
      }
    }
  }), { userJid: m.chat, quoted: m })

  await conn.relayMessage(m.chat, template.message, { messageId: template.key.id })
}

handler.command = /^botones$/i
export default handler