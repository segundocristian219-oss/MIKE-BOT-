let handler = async (m, { conn, text, quoted, participants }) => {
  const texto = (text || '').trim().toLowerCase();

  // Caso 1: Responder con "promote" EXACTO
  if (texto === 'promote' && quoted) {
    if (!m.isGroup) return;
    const userSender = participants.find(u => u.id === m.sender);
    const botSender = participants.find(u => u.id === conn.user.jid);

    if (!userSender?.admin) return;
    if (!botSender?.admin) return;

    let target = m.mentionedJid?.[0] || m.quoted?.sender || m.quoted?.participant || m.quoted?.key?.participant;
    if (!target) return;

    await conn.groupParticipantsUpdate(m.chat, [target], 'promote');
    return;
  }

  // Caso 2: promote con texto (ejemplo: promote @521...)
  if (texto.startsWith('promote')) {
    let number;

    if (m.mentionedJid?.length) {
      number = m.mentionedJid[0].split('@')[0];
    } else if (!isNaN(text.replace(/promote/i, '').trim())) {
      number = text.replace(/promote/i, '').trim();
    } else if (quoted) {
      number = quoted.sender.split('@')[0];
    } else {
      return conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    }

    if (!number || number.length > 13 || number.length < 8) {
      return conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    }

    let user = number + "@s.whatsapp.net";

    await conn.groupParticipantsUpdate(m.chat, [user], "promote");
    return;
  }

  // Si no coincide ningún caso, reacciona ❌
  return conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
};

handler.customPrefix = /^promote/i;
handler.command = new RegExp();
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;