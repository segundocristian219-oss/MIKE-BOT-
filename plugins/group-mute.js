import fetch from 'node-fetch';

let mutedUsers = new Set();
let spamTracker = new Map();
let tempBlocked = new Set();

const SPAM_THRESHOLD = 5; // Cantidad de mensajes para considerar spam
const SPAM_WINDOW = 3000; // Tiempo en ms para contar mensajes
const TEMP_BLOCK_MS = 1500; // Bloqueo temporal antes de mute automático

// ==========================================
// Función para enviar mensaje con preview
// ==========================================
async function sendPreview(conn, chat, user, text, titleUrl, titleText) {
  try {
    const buffer = await fetch(titleUrl).then(res => res.buffer());
    const preview = {
      key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: chat },
      message: { locationMessage: { name: titleText, jpegThumbnail: buffer } }
    };
    await conn.sendMessage(chat, { text, mentions: [user] }, { quoted: preview });
  } catch {}
}

// ==========================================
// Handler principal
// ==========================================
const handler = async (m, { conn, command }) => {
  if (!m.isGroup || m.fromMe) return;
  const user = m.sender;
  const chat = m.chat;

  // ==========================================
  // Comandos manuales mute/unmute
  // ==========================================
  if (command && ['mute', 'unmute'].includes(command)) {
    const target = m.quoted?.sender || m.mentionedJid?.[0];
    if (!target) return m.reply('⚠️ Usuario inválido.');
    if (target === m.sender) return m.reply('❌ No puedes mutearte a ti mismo.');

    if (command === 'mute') {
      mutedUsers.add(target);
      await sendPreview(conn, chat, target, '*Tus mensajes serán eliminados*',
        'https://telegra.ph/file/f8324d9798fa2ed2317bc.png', 'Usuario mutado');
    } else {
      if (!mutedUsers.has(target)) return m.reply('⚠️ Ese usuario no está muteado.');
      mutedUsers.delete(target);
      await sendPreview(conn, chat, target, '*Tus mensajes no serán eliminados*',
        'https://telegra.ph/file/aea704d0b242b8c41bf15.png', 'Usuario desmuteado');
    }
    return;
  }

  // ==========================================
  // Eliminación instantánea si está muteado o bloqueado temporalmente
  // ==========================================
  if (mutedUsers.has(user) || tempBlocked.has(user)) {
    await conn.sendMessage(chat, { delete: m.key }).catch(() => {});
    return;
  }

  // ==========================================
  // Anti-spam ultra rápido
  // ==========================================
  if (!spamTracker.has(user)) spamTracker.set(user, []);
  const timestamps = spamTracker.get(user);
  const now = Date.now();
  while (timestamps.length && now - timestamps[0] > SPAM_WINDOW) timestamps.shift();
  timestamps.push(now);

  if (timestamps.length >= SPAM_THRESHOLD) {
    tempBlocked.add(user);
    setTimeout(() => tempBlocked.delete(user), TEMP_BLOCK_MS);

    setTimeout(() => {
      if (!mutedUsers.has(user)) {
        mutedUsers.add(user);
        sendPreview(conn, chat, user, `⚠️ @${user.split('@')[0]} ha sido muteado automáticamente por spam.`,
          'https://telegra.ph/file/f8324d9798fa2ed2317bc.png', 'Usuario mutado automáticamente por spam');
      }
    }, TEMP_BLOCK_MS);

    // Eliminamos el mensaje actual inmediatamente
    await conn.sendMessage(chat, { delete: m.key }).catch(() => {});
  }
};

// ==========================================
// Metadatos del handler
// ==========================================
handler.help = ['mute @usuario', 'unmute @usuario'];
handler.tags = ['group'];
handler.customPrefix = /^(mute|unmute|.mute|.unmute)/i;
handler.command = /^(mute|unmute)$/i;
handler.group = true;
handler.admin = true;

export default handler;