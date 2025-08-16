import PhoneNumber from 'awesome-phonenumber'

let handler = async (m, { conn }) => {
  if (m.quoted?.fromMe || m.isButton) return

  const numCreador = '5217227584934'
  const name = '𝐀𝐍𝐆𝐄𝐋 🧨'
  const about = '𝐒𝐨𝐲 𝐀𝐧𝐠𝐞𝐥, 𝐃𝐮𝐞𝐧̃𝐨 𝐝𝐞𝐥 𝐁𝐨𝐭 𝐀𝐧𝐠𝐞𝐥 𝐛𝐨𝐭 🧨'
  const empresa = '𝐀𝐧𝐠𝐞𝐋 - 𝐒𝐞𝐫𝐯𝐢𝐜𝐢𝐨𝐬 𝐭𝐞𝐜𝐧𝐨𝐥𝐨́𝐠𝐢𝐜𝐨𝐬 🧨'
  const instagramUrl = 'https://www.instagram.com/angxll_br?igsh=MXF1NWVtZ2xuejFlOA=='
  const imageUrl = 'https://files.catbox.moe/ntyp5r.jpg'

  const vcard = `
BEGIN:VCARD
VERSION:3.0
N:;${name};;;
FN:${name}
ORG:${empresa};
TITLE:CEO & Fundador
TEL;waid=${numCreador}:${new PhoneNumber('+' + numCreador).getNumber('e164')}
EMAIL:correo@empresa.com
URL:${instagramUrl}
NOTE:${about}
ADR:;;Dirección de tu empresa;;;;
X-WA-BIZ-NAME:${name}
X-WA-BIZ-DESCRIPTION:${about}
END:VCARD`.trim()

  // 1️⃣ Enviar solo contacto primero
  await conn.sendMessage(m.chat, {
    contacts: [{ displayName: name, vcard }]
  }, { quoted: m })

  // 2️⃣ Enviar mensaje con preview/thumbnail opcional
  await conn.sendMessage(m.chat, {
    text: '𝐀𝐍𝐆𝐄𝐋 🧨\nDueño del bot.',
    contextInfo: {
      externalAdReply: {
        title: '𝐀𝐍𝐆𝐄𝐋 𝐁𝐎𝐓 🧨',
        body: '𝐀𝐍𝐆𝐄𝐋 🧨',
        thumbnailUrl: imageUrl,
        sourceUrl: instagramUrl,
        mediaType: 1,
        showAdAttribution: true,
        renderLargerThumbnail: true
      }
    }
  })

  // 3️⃣ Reaccionar al mensaje original
  await conn.sendMessage(m.chat, {
    react: {
      text: '🧨',
      key: m.key
    }
  })
}

handler.help = ['owner']
handler.tags = ['owner']
handler.customPrefix = /^(\.owner|owner)$/i
handler.command = new RegExp();
handler.register = false
export default handler