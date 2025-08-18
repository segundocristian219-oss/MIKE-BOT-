import { DisconnectReason, useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, jidNormalizedUser } from '@whiskeysockets/baileys'
import qrcode from 'qrcode'
import fs from 'fs'
import pino from 'pino'
import crypto from 'crypto'
import NodeCache from 'node-cache'
import { makeWASocket } from '../lib/simple.js'

if (!(global.conns instanceof Array)) global.conns = []

let handler = async (m, { conn, args, usedPrefix, command }) => {

  let parentw = args[0] && args[0] == "plz" ? conn : await global.conn

  if (!(args[0] && args[0] == 'plz' || (await global.conn).user.jid == conn.user.jid)) {
    return m.reply("Este comando solo puede ser usado en el bot principal! wa.me/" + global.conn.user.jid.split`@`[0] + "?text=" + usedPrefix + "serbot")
  }

  async function serbot() {
    // 🔹 carpeta de sesiones
    let serbotFolder = crypto.randomBytes(10).toString('hex').slice(0, 8)
    let folderSub = `./sessions/${serbotFolder}`
    if (!fs.existsSync(folderSub)) fs.mkdirSync(folderSub, { recursive: true })
    if (args[0]) fs.writeFileSync(`${folderSub}/creds.json`, Buffer.from(args[0], 'base64').toString('utf-8'))

    const { state, saveCreds } = await useMultiFileAuthState(folderSub)
    const msgRetryCounterCache = new NodeCache()
    const { version } = await fetchLatestBaileysVersion()

    const connectionOptions = {
      logger: pino({ level: 'silent' }),
      printQRInTerminal: true,
      browser: ['Sumi Sakursawa', 'Safari', '2.0.0'],
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
      },
      markOnlineOnConnect: true,
      generateHighQualityLinkPreview: true,
      msgRetryCounterCache,
      version
    }

    let conn = makeWASocket(connectionOptions)
    conn.isInit = false

    // ✅ Asignar handler del main bot inmediatamente
    const mainHandler = (await import("../handler.js")).handler
    conn.handler = async function(m) {
      try {
        if (m.isGroup) {
          const metadata = await conn.groupMetadata(m.chat)
          const admins = metadata.participants.filter(u => u.admin !== null).map(u => u.id)
          m.isAdmin = admins.includes(m.sender)
          m.isSuperAdmin = admins.includes(conn.user.jid)
        }

        // Checks de owner y prems desde la base global
        m.isOwner = global.db.data?.owners?.includes(m.sender) || false
        m.isPrems = global.db.data?.users?.[m.sender]?.prems || false

        // Ejecutar el handler original
        await mainHandler.call(conn, m, {
          conn,
          args: m.text?.split(' ') || [],
          usedPrefix: '.',
          command: m.text?.split(' ')[0] || ''
        })
      } catch (e) {
        console.error(e)
      }
    }

    // Registrar eventos
    conn.ev.on("messages.upsert", conn.handler)
    conn.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect, qr } = update

      if (qr) {
        let txt = '`🧃 S E R B O T - S U B B O T`\n\n'
        txt += 'Escanea este QR para usar el Sub Bot\n\n> Nota: Expira en 30s'

        // Enviar QR como mensaje independiente
        let sendQR = await parentw.sendFile(
          m.chat,
          await qrcode.toDataURL(qr, { scale: 8 }),
          "qrcode.png",
          txt
        )

        // Eliminar el QR después de 30 segundos
        setTimeout(() => {
          try {
            parentw.sendMessage(m.chat, { delete: sendQR.key })
          } catch {}
        }, 30000)
      }

      const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode
      if (connection === "open") {
        conn.isInit = true
        global.conns.push(conn)
        await parentw.reply(m.chat, args[0] ? 'Sub Bot conectado' : `Conectado exitosamente con WhatsApp\n*Nota:* Si el bot principal se reinicia, este sub bot también lo hará`, m)
      }

      if (code && code !== DisconnectReason.loggedOut) {
        let i = global.conns.indexOf(conn)
        if (i >= 0) {
          delete global.conns[i]
          global.conns.splice(i, 1)
        }
        if (code !== DisconnectReason.connectionClosed) {
          await parentw.reply(conn.user.jid, "Conexión perdida...", m)
        }
      }
    })

    conn.ev.on("creds.update", saveCreds.bind(conn, true))
  }

  serbot()
}

handler.help = ["serbot"]
handler.tags = ["serbot"]
handler.command = ['qr']

export default handler