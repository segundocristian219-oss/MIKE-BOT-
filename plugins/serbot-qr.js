import { DisconnectReason, useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, jidNormalizedUser } from '@whiskeysockets/baileys'
import qrcode from 'qrcode'
import fs from 'fs'
import pino from 'pino'
import crypto from 'crypto'
import NodeCache from 'node-cache'
import { makeWASocket } from '../lib/simple.js'

if (!global.conns) global.conns = []

let handler = async (m, { conn, args, usedPrefix, command }) => {
  // Solo el bot principal puede iniciar un sub-bot
  let parentw = args[0] && args[0] === "plz" ? conn : await global.conn
  if (!(args[0] === 'plz' || (await global.conn).user.jid === conn.user.jid)) {
    return m.reply("Este comando solo puede ser usado en el bot principal! wa.me/" + global.conn.user.jid.split`@`[0] + "?text=" + usedPrefix + "serbot")
  }

  async function serbot() {
    // Crear carpeta temporal del sub-bot
    let serbotFolder = crypto.randomBytes(10).toString('hex').slice(0, 8)
    let folderSub = `./serbot/${serbotFolder}`
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

    let subConn = makeWASocket(connectionOptions)
    subConn.isInit = false
    let isInit = true

    // ===== Función para actualizar roles de grupo =====
    async function updateGroupRoles(chatId) {
      try {
        const metadata = await subConn.groupMetadata(chatId)
        const participants = metadata.participants || []
        let roles = {}
        for (let user of participants) {
          roles[user.id] = {
            isAdmin: user.admin === 'admin' || user.admin === 'superadmin',
            isOwner: user.admin === 'superadmin'
          }
        }
        return roles
      } catch (e) {
        console.error("No se pudo obtener metadata del grupo:", e)
        return {}
      }
    }

    // ===== Manejo de conexión =====
    async function connectionUpdate(update) {
      const { connection, lastDisconnect, isNewLogin, qr } = update

      if (isNewLogin) subConn.isInit = true

      if (qr) {
        let txt = '`🧃 S E R B O T - S U B B O T`\n\n'
        txt += '  *Escanea este QR para ser un Sub Bot*\n'
        txt += '  `Pasos para escanear`\n'
        txt += '  `1` : Haga click en los 3 puntos\n'
        txt += '  `2` : Toque dispositivos vinculados\n'
        txt += '  `3` : Escanea este QR\n\n'
        txt += `> *Nota:* Este código QR expira en 30 segundos.`

        let sendQR = await parentw.sendFile(m.chat, await qrcode.toDataURL(qr, { scale: 8 }), "qrcode.png", txt, m, null, rcanal)

        setTimeout(() => {
          parentw.sendMessage(m.chat, { delete: sendQR.key })
        }, 30000)
      }

      const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode
      if (code && code !== DisconnectReason.loggedOut && subConn?.ws.socket == null) {
        let i = global.conns.indexOf(subConn)
        if (i < 0) return console.log(await creloadHandler(true).catch(console.error))
        global.conns.splice(i, 1)
        if (code !== DisconnectReason.connectionClosed) {
          await parentw.reply(subConn.user.jid, "Conexión perdida...", m, rcanal)
        }
      }

      if (global.db.data == null) loadDatabase()

      if (connection == "open") {
        subConn.isInit = true
        global.conns.push(subConn)
        await parentw.reply(m.chat, args[0] ? 'Conectado con éxito' : 'Conectado exitosamente con WhatsApp\n\n*Nota:* Esto es temporal\nSi el Bot principal se reinicia o se desactiva, todos los sub-bots también lo harán', m, rcanal)

        // ===== Reconocer roles del bot y usuarios =====
        let groupRoles = await updateGroupRoles(m.chat)
        const senderId = m.sender
        const isAdmin = groupRoles[senderId]?.isAdmin || false
        const isOwner = groupRoles[senderId]?.isOwner || false
        const botId = subConn.user.jid
        const botIsAdmin = groupRoles[botId]?.isAdmin || false

        console.log({
          isAdmin, isOwner, botIsAdmin
        })

        if (!args[0]) {
          await parentw.reply(subConn.user.jid, "La siguiente vez que se conecte envía el siguiente mensaje para iniciar sesión sin escanear otro código QR", m, rcanal)
          await parentw.reply(subConn.user.jid, usedPrefix + command + " " + Buffer.from(fs.readFileSync(`${folderSub}/creds.json`), 'utf-8').toString('base64'), m, rcanal)
        }
      }
    }

    // ===== Timeout por QR no escaneado =====
    setTimeout(() => {
      if (!subConn.user) {
        try { subConn.ws.close() } catch {}
        subConn.ev.removeAllListeners()
        let i = global.conns.indexOf(subConn)
        if (i >= 0) global.conns.splice(i, 1)
        fs.rmdirSync(`./serbot/${serbotFolder}`, { recursive: true })
      }
    }, 30000)

    // ===== Recarga de handler =====
    let handlerModule = await import("../handler.js")
    let creloadHandler = async function(restarConn) {
      try {
        const Handler = await import(`../handler.js?update=${Date.now()}`).catch(console.error)
        if (Object.keys(Handler || {}).length) handlerModule = Handler
      } catch (e) { console.error(e) }

      if (restarConn) {
        try { subConn.ws.close() } catch {}
        subConn.ev.removeAllListeners()
        subConn = makeWASocket(connectionOptions)
        isInit = true
      }

      if (!isInit) {
        subConn.ev.off("messages.upsert", subConn.handler)
        subConn.ev.off("connection.update", subConn.connectionUpdate)
        subConn.ev.off('creds.update', subConn.credsUpdate)
      }

      subConn.handler = handlerModule.handler.bind(subConn)
      subConn.connectionUpdate = connectionUpdate.bind(subConn)
      subConn.credsUpdate = saveCreds.bind(subConn, true)

      subConn.ev.on("messages.upsert", subConn.handler)
      subConn.ev.on("connection.update", subConn.connectionUpdate)
      subConn.ev.on("creds.update", subConn.credsUpdate)
      isInit = false
      return true
    }

    creloadHandler(false)
  }

  serbot()
}

handler.help = ["serbot"]
handler.tags = ["serbot"]
handler.command = ['qr', 'jadibotsisked', 'qrsisked']

export default handler

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}