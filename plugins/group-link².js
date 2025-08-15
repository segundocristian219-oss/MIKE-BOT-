const handler = async (m, { conn, isAdmin }) => {
  if (!isAdmin) return;

  // Obtenemos el código de invitación del grupo
  const code = await conn.groupInviteCode(m.chat);
  const inviteLink = 'https://chat.whatsapp.com/' + code;

  // Obtenemos datos del grupo
  let metadata = {}
  try {
    metadata = await conn.groupMetadata(m.chat);
  } catch (e) {
    console.log(e);
  }

  // Foto de grupo o imagen por defecto
  let pfp = 'https://i.ibb.co/7QpKsCX/default-group.png'; // Imagen por defecto
  try {
    if (metadata?.icon) {
      pfp = await conn.profilePictureUrl(m.chat, 'image');
    }
  } catch (e) { }

  // Enviamos mensaje tipo vista previa de grupo, respondiendo al usuario
  conn.sendMessage(m.chat, {
    text: `Invitación al grupo *${metadata?.subject || 'Este grupo'}*`,
    contextInfo: {
      externalAdReply: {
        title: metadata?.subject || 'Grupo de WhatsApp',
        body: '¡Únete al grupo!',
        thumbnailUrl: pfp,
        sourceUrl: inviteLink,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: m }); // <--- Aquí responde al mensaje que pidió link
};

handler.customPrefix = /^(link|.link)$/i;
handler.command = new RegExp;
handler.group = true;
handler.admin = true;

export default handler;