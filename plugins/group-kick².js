const handler = async (m, { conn }) => {
  // Mensajes configurables del handler
  const msgNoTarget = '_Menciona o responde al usuario que deseas eliminar._';
  const msgSuccess = '☠️ Intruso eliminado.';
  const msgError = '_No pude expulsar al usuario. Asegúrate de que soy admin y de que el objetivo no sea admin/owner._';

  const target = (m.mentionedJid && m.mentionedJid.length)
    ? m.mentionedJid[0]
    : m.quoted?.sender;

  if (!target) return m.reply(msgNoTarget);

  try {
    await conn.groupParticipantsUpdate(m.chat, [target], 'remove');
    return m.reply(msgSuccess);
  } catch {
    return m.reply(msgError);
  }
};

// Acepta "kick", ".kick", y variantes con texto/mención después
handler.customPrefix = /^(?:\.?kick)(?:\s+|$)/i;
handler.command = new RegExp();
handler.group = true;
handler.admin = true;

export default handler;