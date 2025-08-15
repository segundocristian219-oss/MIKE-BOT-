const handler = async (m, { conn, isAdmin }) => {
  if (!isAdmin) return;

  const code = await conn.groupInviteCode(m.chat);
  const link = 'https://chat.whatsapp.com/' + code;

  // Obtiene info del grupo
  const group = await conn.groupMetadata(m.chat);
  
  // Enviar como invitación con vista previa
  await conn.sendMessage(m.chat, {
    groupInviteMessage: {
      groupJid: m.chat,
      inviteCode: code,
      groupName: group.subject,
      caption: link,
      jpegThumbnail: group.picture ? await conn.getProfilePicture(m.chat, 'image') : null
    }
  });
};

handler.customPrefix = /^(link|\.link)$/i;
handler.command = new RegExp;
handler.group = true;
handler.admin = true;

export default handler;