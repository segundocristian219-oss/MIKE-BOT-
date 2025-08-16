import PhoneNumber from 'awesome-phonenumber'

let handler = async (m, { conn }) => {
  if (m.quoted?.fromMe || m.isButton) return

  m.react('🔮')

  const imageUrl = 'https://cdn.russellxz.click/aa176879.jpeg'
  const numCreador = '5215565238431'
  const ownerJid = numCreador + '@s.whatsapp.net'

  const name = '𝐂𝐫𝐢𝐬𝐭𝐢𝐚𝐧 🔮'
  const about = '𝐒𝐨𝐲 𝐂𝐫𝐢𝐬𝐭𝐢𝐚𝐧, 𝐃𝐮𝐞𝐧̃𝐨 𝐃𝐞𝐥 𝐁𝐨𝐭: 𝐁𝐮𝐮 𝐛𝐨𝐭🔮'
  const empresa = '𝐂𝐫𝐢𝐬𝐭𝐢𝐚𝐧 - 𝐒𝐞𝐫𝐯𝐢𝐜𝐢𝐨𝐬 𝐭𝐞𝐜𝐧𝐨𝐥𝐨́𝐠𝐢𝐜𝐨𝐬 🔮'
  const instagramUrl = ''

  const vcard = `
BEGIN:VCARD
VERSION:3.0
N:;${name};;;
FN:${name}
ORG:${empresa};
TITLE:CEO & Fundador
TEL;waid=${numCreador}:${new PhoneNumber('+' + numCreador).getNumber('international')}
EMAIL:correo@empresa.com
URL:${instagramUrl}
NOTE:${about}
ADR:;;Dirección de tu empresa;;;;
X-ABADR:ES
X-ABLabel:Dirección Web
X-ABLabel:Correo Electrónico
X-ABLabel:Teléfono de contacto
X-WA-BIZ-NAME:${name}
X-WA-BIZ-DESCRIPTION:${about}
END:VCARD`.trim()

  await conn.sendMessage(
    m.chat,
    {
      contacts: {
        displayName: name,
        contacts: [{ vcard }]
      },
      contextInfo: {
        mentionedJid: [m.sender],
        externalAdReply: {
          title: '𝐁𝐮𝐮 𝐛𝐨𝐭 🔮',
          body: '𝐁𝐮𝐮 𝐛𝐨𝐭 🔮',
          thumbnailUrl: imageUrl,
          sourceUrl: instagramUrl,
          mediaType: 1,
          showAdAttribution: true,
          renderLargerThumbnail: true
        }
      }
    },
    { quoted: m }
  )
}

handler.help = ['owner']
handler.tags = ['owner']
handler.command = /^\owner$/i
handler.register = false
export default handler