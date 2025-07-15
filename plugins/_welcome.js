import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return true

  const videoUrl = 'https://files.catbox.moe/em05p6.mp4'
  const defaultImage = 'https://files.catbox.moe/0gel94.jpg'
  let chat = global.db.data.chats[m.chat]
  let who = m.messageStubParameters[0]
  let user = `@${who.split`@`[0]}`
  let groupName = groupMetadata.subject
  let groupDesc = groupMetadata.desc || 'sin descripción'
  let dev = 'By: Shadow 🍷'
  let estilo = {} // si usas quoted

  // FOTO DE PERFIL
  let hasProfile = false
  let media
  try {
    let pp = await conn.profilePictureUrl(who, 'image')
    media = await (await fetch(pp)).buffer()
    hasProfile = true
  } catch {
    hasProfile = false
  }

  // BIENVENIDA
  if (chat.bienvenida && m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
    let welcomeMsg = `┌─★ 𝙎𝙃𝘼𝘿𝙊𝙒 𝘽𝙊𝙏 🍷\n│「 Bienvenido 」\n└┬★ 「 ${user} 」\n   │💛 ${chat.welcomeMessage || 'Bienvenido/a :'}\n   │💛 ${groupName}\n   └───────────────┈ ⳹\n> ${dev}`

    await conn.sendMessage(m.chat, {
      ...(hasProfile
        ? { image: media }
        : { video: { url: videoUrl }, gifPlayback: true }),
      caption: welcomeMsg,
      mentions: [who]
    }, { quoted: estilo })
  }

  // DESPEDIDA
  if (chat.bienvenida && (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE || m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE)) {
    let byeMsg = `┌─★ 𝙎𝙃𝘼𝘿𝙊𝙒 𝘽𝙊𝙏 🍷\n│「 ADIOS 👋 」\n└┬★ 「 ${user} 」\n   │💛 ${chat.despMessage || 'Se Fue😹'}\n   │💛 Jamás te quisimos aquí\n   └───────────────┈ ⳹\n> ${dev}`

    await conn.sendMessage(m.chat, {
      ...(hasProfile
        ? { image: media }
        : { video: { url: videoUrl }, gifPlayback: true }),
      caption: byeMsg,
      mentions: [who]
    }, { quoted: estilo })
  }

  return true
}