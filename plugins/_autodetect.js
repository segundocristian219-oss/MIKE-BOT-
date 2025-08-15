import path from 'path';
import { promises as fs } from 'fs';

export default function setupGroupEvents(conn) {
  conn.ev.on('messages.upsert', async ({ messages }) => {
    for (let m of messages) {
      if (!m.key?.remoteJid?.endsWith('@g.us')) continue;
      if (typeof m.messageStubType !== 'number') continue;

      let usuario = `@${(m.key.participant || m.participant || m.pushName || m.sender || 'desconocido').split('@')[0]}`;

      let fkontak = {
        "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" },
        "message": {
          "contactMessage": {
            "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${usuario.replace('@','')}:${usuario.replace('@','')}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
          }
        },
        "participant": "0@s.whatsapp.net"
      };

      let participants = [];
      try {
        let metadata = await conn.groupMetadata(m.key.remoteJid);
        participants = metadata.participants || [];
      } catch (e) {}

      const groupAdmins = participants.filter(p => p.admin);

      // 🔹 Limpieza de sesiones (tipo 2)
      if (m.messageStubType == 2) {
        try {
          const uniqid = m.key.remoteJid.split('@')[0];
          const sessionPath = './sessions/';
          const files = await fs.readdir(sessionPath);
          let filesDeleted = 0;

          for (const file of files) {
            if (file.includes(uniqid)) {
              await fs.unlink(path.join(sessionPath, file));
              filesDeleted++;
            }
          }

          if (filesDeleted > 0) {
            console.log(`🧹 Se eliminaron ${filesDeleted} archivos de sesión relacionados con el grupo ${uniqid}`);
          } else {
            console.log(`✅ No se encontraron sesiones obsoletas para el grupo ${uniqid}`);
          }
        } catch (e) {
          console.error(`❌ Error al intentar limpiar sesiones para el grupo: ${m.key.remoteJid}`);
          console.error(e);
        }
      }

      switch (m.messageStubType) {
        case 21:
          await conn.sendMessage(m.key.remoteJid, {
            text: `${usuario} \`𝐇𝐀 𝐂𝐀𝐌𝐁𝐈𝐀𝐃𝐎 𝐄𝐋 𝐍𝐎𝐌𝐁𝐑𝐄 𝐃𝐄𝐋 𝐆𝐑𝐔𝐏𝐎 𝐀:\`\n\n> *${m.messageStubParameters[0]}*`,
            mentions: [usuario, ...groupAdmins.map(v => v.id)]
          }, { quoted: fkontak });
          break;

        case 22:
          await conn.sendMessage(m.key.remoteJid, {
            text: `${usuario} \`𝐂𝐀𝐌𝐁𝐈𝐎 𝐋𝐀 𝐅𝐎𝐓𝐎 𝐃𝐄𝐋 𝐆𝐑𝐔𝐏𝐎\``,
            mentions: [usuario]
          }, { quoted: fkontak });
          break;

        case 24:
          await conn.sendMessage(m.key.remoteJid, {
            text: `${usuario} > 𝐍𝐔𝐄𝐕𝐀 𝐃𝐄𝐒𝐂𝐑𝐈𝐏𝐂𝐈𝐎́𝐍:\n\n${m.messageStubParameters[0]}`,
            mentions: [usuario]
          }, { quoted: fkontak });
          break;

        case 25:
          await conn.sendMessage(m.key.remoteJid, {
            text: `📌 𝐀𝐇𝐎𝐑𝐀 *${m.messageStubParameters[0] === 'on' ? '𝐒𝐎𝐋𝐎 𝐀𝐃𝐌𝐈𝐍𝐒' : '𝐓𝐎𝐃𝐎𝐒'}* 𝐏𝐔𝐄𝐃𝐄𝐍 𝐄𝐃𝐈𝐓𝐀𝐑 𝐋𝐀 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐂𝐈𝐎́𝐍 𝐃𝐄𝐋 𝐆𝐑𝐔𝐏𝐎`,
            mentions: [usuario]
          }, { quoted: fkontak });
          break;

        case 26:
          await conn.sendMessage(m.key.remoteJid, {
            text: `𝐆𝐑𝐔𝐏𝐎 *${m.messageStubParameters[0] === 'on' ? '𝐂𝐄𝐑𝐑𝐀𝐃𝐎 🔒' : '𝐀𝐁𝐈𝐄𝐑𝐓𝐎 🔓'}*\n ${m.messageStubParameters[0] === 'on' ? '𝐒𝐎𝐋𝐎 𝐀𝐃𝐌𝐈𝐍𝐒 𝐏𝐔𝐄𝐃𝐄𝐍 𝐄𝐒𝐂𝐑𝐈𝐁𝐈𝐑' : '𝐘𝐀 𝐓𝐎𝐃𝐎𝐒 𝐏𝐔𝐄𝐃𝐄𝐍 𝐄𝐒𝐂𝐑𝐈𝐁𝐈𝐑'} 𝐄𝐍 𝐄𝐒𝐓𝐄 𝐆𝐑𝐔𝐏𝐎`,
            mentions: [usuario]
          }, { quoted: fkontak });
          break;

        case 29:
          await conn.sendMessage(m.key.remoteJid, {
            text: `@${m.messageStubParameters[0].split`@`[0]} 𝐀𝐇𝐎𝐑𝐀 𝐓𝐈𝐄𝐍𝐄 𝐏𝐎𝐃𝐄𝐑𝐄𝐒 \n\n📌 𝐋𝐄 𝐎𝐓𝐎𝐑𝐆𝐎́ 𝐀𝐃𝐌𝐈𝐍  ${usuario}`,
            mentions: [usuario, m.messageStubParameters[0], ...groupAdmins.map(v => v.id)]
          }, { quoted: fkontak });
          break;

        case 30:
          await conn.sendMessage(m.key.remoteJid, {
            text: `@${m.messageStubParameters[0].split`@`[0]} 𝐘𝐀 𝐍𝐎 𝐓𝐈𝐄𝐍𝐄 𝐏𝐎𝐃𝐄𝐑𝐄𝐒\n\n📌 𝐋𝐄 𝐐𝐔𝐈𝐓𝐎 𝐀𝐃𝐌𝐈𝐍  ${usuario}`,
            mentions: [usuario, m.messageStubParameters[0], ...groupAdmins.map(v => v.id)]
          }, { quoted: fkontak });
          break;

        case 72:
          await conn.sendMessage(m.key.remoteJid, {
            text: `${usuario} 𝐂𝐀𝐌𝐁𝐈𝐎 𝐋𝐀 𝐃𝐔𝐑𝐀𝐂𝐈𝐎́𝐍 𝐃𝐄 𝐋𝐎𝐒 𝐌𝐄𝐍𝐒𝐀𝐉𝐄𝐒 𝐓𝐄𝐌𝐏𝐎𝐑𝐀𝐋𝐄𝐒 𝐀 *@${m.messageStubParameters[0]}*`,
            mentions: [usuario]
          }, { quoted: fkontak });
          break;

        case 123:
          await conn.sendMessage(m.key.remoteJid, {
            text: `${usuario} 𝐃𝐄𝐒𝐀𝐂𝐓𝐈𝐕𝐎 𝐋𝐎𝐒 𝐌𝐄𝐍𝐒𝐀𝐉𝐄𝐒 𝐓𝐄𝐌𝐏𝐎𝐑𝐀𝐋𝐄𝐒.`,
            mentions: [usuario]
          }, { quoted: fkontak });
          break;

        default:
          console.log({
            messageStubType: m.messageStubType,
            messageStubParameters: m.messageStubParameters
          });
      }
    }
  });
}