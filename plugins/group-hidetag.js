const fs = require("fs");
const path = require("path");

const handler = async (m, { conn, args, isAdmin, isBotAdmin, isOwner }) => {
  if (!m.isGroup) return global.dfail('group', m, conn);
  if (!isAdmin && !isOwner) return global.dfail('admin', m, conn);
  if (!isBotAdmin) return global.dfail('botAdmin', m, conn);

  // Leer prefix (opcional, si lo usas)
  const rawID = conn.user?.id || "";
  const subbotID = rawID.split(":")[0] + "@s.whatsapp.net";

  const prefixPath = path.resolve("prefixes.json");
  let prefixes = {};
  if (fs.existsSync(prefixPath)) {
    prefixes = JSON.parse(fs.readFileSync(prefixPath, "utf-8"));
  }
  const usedPrefix = prefixes[subbotID] || ".";

  const chatId = m.chat;
  const users = m.isGroup ? (await conn.groupMetadata(chatId)).participants.map(p => p.id) : [];

  let messageToForward = null;

  // Si hay mensaje citado
  if (m.quoted) {
    try {
      const quoted = m.quoted;
      const mime = (quoted.msg || quoted)?.mimetype || '';
      const isMedia = /image|video|audio|sticker|document/.test(mime);

      if (isMedia) {
        const media = await quoted.download();
        if (!media) return m.reply('❌ No se pudo descargar el contenido citado.');

        if (/image/.test(mime)) {
          messageToForward = { image: media, caption: args.join(" ") || "" };
        } else if (/video/.test(mime)) {
          messageToForward = { video: media, caption: args.join(" ") || "", mimetype: 'video/mp4' };
        } else if (/audio/.test(mime)) {
          messageToForward = { audio: media, mimetype: 'audio/mpeg', ptt: false };
        } else if (/sticker/.test(mime)) {
          messageToForward = { sticker: media };
        } else if (/document/.test(mime)) {
          messageToForward = { document: media, caption: args.join(" ") || "" };
        }
      } else {
        // Texto simple
        const citado = quoted.text || quoted.body || '';
        messageToForward = { text: args.join(" ") ? `${args.join(" ")}\n\n${citado}` : citado };
      }
    } catch (e) {
      return m.reply("❌ Error al procesar el mensaje citado.");
    }
  }

  // Si no hay mensaje citado, tomar texto que mandaron
  if (!messageToForward) {
    if (args.join(" ").trim().length === 0)
      return m.reply("⚠️ Debes responder a un mensaje o proporcionar un texto para reenviar.");

    messageToForward = { text: args.join(" ") };
  }

  // Enviar con mención a todos
  await conn.sendMessage(chatId, {
    ...messageToForward,
    mentions: users
  }, { quoted: m });
};

handler.command = ['tag', 'n'];
handler.admin = true;
handler.botAdmin = true;
handler.group = true;

module.exports = handler;