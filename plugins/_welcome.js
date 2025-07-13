import { WAMessageStubType } from '@whiskeysockets/baileys'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return true;

  const videoUrl = 'https://files.catbox.moe/blvtbw.mp4';
  const chat = global.db.data.chats[m.chat];
  const user = `@${m.messageStubParameters[0].split('@')[0]}`;
  const groupName = groupMetadata.subject;
  const groupDesc = groupMetadata.desc || 'Sin descripción';

  // 🟢 BIENVENIDA
  if (chat.bienvenida && m.messageStubType == 27) {
    const msgsWelcome = [
      `┏─────────────────┐
「 ${user} 」
𝘽𝙄𝙀𝙉𝙑𝙀𝙉𝙄𝘿𝙓 😊
𝑫𝒊𝒔𝒇𝒓𝒖𝒕𝒂 𝒅𝒆 𝒕𝒖 𝒆𝒔𝒕𝒂𝒅𝒊𝒂 𝒓𝒆𝒄𝒖𝒆𝒓𝒅𝒂 𝒄𝒖𝒎𝒑𝒍𝒊𝒓 𝒍𝒂𝒔 𝒓𝒆𝒈𝒍𝒂𝒔 𝒚 𝒍𝒆𝒆𝒓 𝒍𝒂 𝒅𝒆𝒔𝒄𝒓𝒊𝒑𝒄𝒊𝒐𝒏 ✨
└───── 𝙎𝙃𝘼𝘿𝙊𝙒 𝘽𝙊𝙏 🍷─────┘`,
      `┏━━━━━━━━━━━━
┃──〘 *𝗕𝗜𝗘𝗡𝗩𝗘𝗡𝗜𝗗𝗫* 〙───
┃━━━━━━━━━━━━
┃ *_🍷 𝗘𝗡𝗧𝗥𝗢   ${user}_* 
┃ *_Un gusto tenerte aqui_*
┃ *_Disfruta tu estadía 😇_*
┗━━━𝙎𝙃𝘼𝘿𝙊𝙒 𝘽𝙊𝙏 🍷━━━━`
    ];

    const welcome = chat.sWelcome
      ? chat.sWelcome
          .replace(/@user/g, user)
          .replace(/@group/g, groupName)
          .replace(/@desc/g, groupDesc)
      : msgsWelcome[Math.floor(Math.random() * msgsWelcome.length)];

    await conn.sendMessage(m.chat, {
      video: { url: videoUrl },
      caption: welcome,
      gifPlayback: true,
      mentions: [m.messageStubParameters[0]]
    }, { quoted: m });
  }

  // 🔴 DESPEDIDA (salida voluntaria o kick)
  if (chat.bienvenida && (m.messageStubType == 28 || m.messageStubType == 32)) {
    const msgsBye = [
      `*╭┈┈┈┈┈┈┈┈┈┈┈┈┈≫*
*┊* *${user}*
*┊𝗧𝗨 𝗔𝗨𝗦𝗘𝗡𝗖𝗜𝗔 𝗙𝗨𝗘 𝗖𝗢𝗠𝗢 𝗨𝗡 𝗤𝗟𝗢,* 
*┊𝗖𝗢𝗡 𝗢𝗟𝗢𝗥 𝗔 𝗠𝗥𝗗!!* 👿
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈≫*`,
      `*╭┈┈┈┈┈┈┈┈┈┈┈┈┈≫*
*┊* *${user}*
*┊𝗔𝗟𝗚𝗨𝗜𝗘𝗡 𝗠𝗘𝗡𝗢𝗦, 𝗤𝗨𝗜𝗘𝗡 𝗧𝗘 𝗥𝗘𝗖𝗨𝗘𝗥𝗗𝗘* 
*┊𝗦𝗘𝗥𝗔 𝗣𝗢𝗥 𝗟𝗔𝗦𝗧𝗜𝗠𝗔, 𝗔𝗗𝗜𝗢𝗦!!* 👿
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈≫*`,
      `*╭┈┈┈┈┈┈┈┈┈┈┈┈┈≫*
*┊* *${user}*
*┊𝗧𝗨 𝗗𝗘𝗦𝗣𝗘𝗗𝗜𝗗𝗔 𝗡𝗢𝗦 𝗛𝗔𝗥𝗔 𝗟𝗟𝗢𝗥𝗔𝗥,* 
*┊𝗗𝗘 𝗟𝗔 𝗩𝗘𝗥𝗚𝗨𝗘𝗡𝗭𝗔 𝗤𝗨𝗘 𝗗𝗔𝗕𝗔𝗦!!* 👿
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈≫*`,
      `*╭┈┈┈┈┈┈┈┈┈┈┈┈┈≫*
*┊* *${user}*
*┊𝗗𝗘𝗝𝗢 𝗗𝗘 𝗢𝗟𝗘𝗥 𝗔 𝗠𝗥𝗗,* 
*┊𝗛𝗔𝗦𝗧𝗔 𝗤𝗨𝗘 𝗧𝗘 𝗟𝗔𝗥𝗚𝗔𝗦𝗧𝗘!!* 👿
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈≫*`
    ];

    const bye = chat.sBye
      ? chat.sBye
          .replace(/@user/g, user)
          .replace(/@group/g, groupName)
          .replace(/@desc/g, groupDesc)
      : msgsBye[Math.floor(Math.random() * msgsBye.length)];

    await conn.sendMessage(m.chat, {
      video: { url: videoUrl },
      caption: bye,
      gifPlayback: true,
      mentions: [m.messageStubParameters[0]]
    }, { quoted: m });
  }
}