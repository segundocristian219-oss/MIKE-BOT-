import { WAMessageStubType } from '@whiskeysockets/baileys';

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return true;

  const chat = global.db.data.chats[m.chat] || {};
  if (!chat.bienvenida) return true; // ← Soporte para .on/.off welcome

  const id = m.messageStubParameters?.[0];
  if (!id) return;

  const user = `@${id.split('@')[0]}`;
  const groupName = groupMetadata.subject;
  const groupDesc = groupMetadata.desc || 'sin descripción';
  const videoUrl = 'https://files.catbox.moe/blvtbw.mp4';

  // Texto por defecto (puedes personalizar)
  const defaultWelcome = `👋 Bienvenid@ ${user} al grupo *${groupName}*!`;
  const defaultBye = `👋 ${user} salió del grupo *${groupName}*.`;

  // → WELCOME (Agregar)
  if (m.messageStubType === WAMessageStubType.ADD) {
    const welcome = (chat.sWelcome || defaultWelcome)
      .replace(/@user/g, user)
      .replace(/@group/g, groupName)
      .replace(/@desc/g, groupDesc);

    await conn.sendMessage(m.chat, {
      video: { url: videoUrl },
      gifPlayback: true,
      caption: welcome,
      mentions: [id]
    }, { quoted: m });
  }

  // → BYE (Salida o Expulsión)
  if ([WAMessageStubType.REMOVE, WAMessageStubType.LEAVE].includes(m.messageStubType)) {
    const bye = (chat.sBye || defaultBye)
      .replace(/@user/g, user)
      .replace(/@group/g, groupName)
      .replace(/@desc/g, groupDesc);

    await conn.sendMessage(m.chat, {
      video: { url: videoUrl },
      gifPlayback: true,
      caption: bye,
      mentions: [id]
    }, { quoted: m });
  }
}