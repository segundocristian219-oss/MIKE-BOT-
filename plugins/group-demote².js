let handler = async (m, { conn }) => {
  const body = m.text?.trim();

  if (!body || !/^\.?demote/i.test(body)) return; // solo .demote o demote

  let user;

  // 1️⃣ Usuario mencionado
  const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
  if (mentioned?.length) user = mentioned[0];

  // 2️⃣ Si no hay mencionado, usar mensaje citado
  if (!user && m.quoted) user = m.quoted.key?.participant || m.quoted.sender;

  // Validación
  if (!user || !user.endsWith('@s.whatsapp.net')) {
    return conn.sendMessage(m.chat, { react: { text: '☁️', key: m.key } });
  }

  try {
    // ⚡ Demote usando ds6/meta
    await conn.groupParticipantsUpdate(m.chat, [user], 'demote');

    // Confirmación
    await conn.sendMessage(m.chat, {
      text: `✅ Se ha quitado admin a @${user.split('@')[0]}`,
      mentions: [user]
    });
  } catch (e) {
    console.log(e);
    await conn.sendMessage(m.chat, {
      text: '⚠️ No se pudo quitar admin. Asegúrate de que el bot sea admin y que el usuario sea admin también.',
      mentions: [user]
    });
  }
};

handler.customPrefix = /^\.?demote/i;
handler.command = new RegExp();
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;