let mutedUsers = new Set();

let handler = async (m, { conn, usedPrefix, command, isAdmin, isOwner, isBotAdmin, args }) => {
  if (!m.isGroup) return global.dfail('group', m, conn);
  if (!isAdmin && !isOwner) return global.dfail('admin', m, conn);
  if (!isBotAdmin) return global.dfail('botAdmin', m, conn);

  let user;
  if (m.quoted) {
    user = m.quoted.sender;
  } else if (args[0]) {
    const mentionedJid = m.mentionedJid?.[0];
    if (!mentionedJid) return m.reply('⚠️ Etiqueta a un usuario válido.');
    user = mentionedJid;
  } else {
    return m.reply('⚠️ Usa: .mute @usuario o responde a su mensaje.');
  }

  if (command === 'mute') {
    if (user === m.sender) return m.reply('❌ No puedes mutearte a ti mismo.');

    mutedUsers.add(user);

    await conn.sendMessage(m.chat, {
      text: `WhatsApp Business\n\n📵 *Usuario mutado*\n🧨 Tus mensajes serán eliminados`,
      contextInfo: {
        externalAdReply: {
          title: 'WhatsApp Business',
          body: 'Usuario mutado',
          thumbnailUrl: 'https://i.ibb.co/3RzG6QG/muted-icon.png',
          mediaType: 1,
          renderLargerThumbnail: true,
          sourceUrl: '',
          showAdAttribution: true
        },
        mentionedJid: [user]
      }
    }, { quoted: m });

  } else if (command === 'unmute') {
    if (user === m.sender) return m.reply('❌ No puedes desmutearte a ti mismo.');

    if (!mutedUsers.has(user)) return m.reply('⚠️ Ese usuario no está muteado.');

    mutedUsers.delete(user);

    await conn.sendMessage(m.chat, {
      text: `✅ *Usuario desmuteado:* @${user.split('@')[0]}`,
      mentions: [user]
    }, { quoted: m });
  }
};

handler.before = async (m, { conn }) => {
  if (!m.isGroup || !m.sender || m.fromMe) return;

  if (mutedUsers.has(m.sender)) {
    try {
      await conn.sendMessage(m.chat, { delete: m.key });
    } catch (e) {
      console.error('[MUTE] Error al eliminar mensaje:', e);
    }
  }
};

handler.help = ['mute @usuario', 'unmute @usuario'];
handler.tags = ['group'];
handler.command = /^(mute|unmute)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;