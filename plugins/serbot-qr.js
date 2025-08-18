import { useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, jidNormalizedUser } from '@whiskeysockets/baileys'
import qrcode from 'qrcode'
import fs from 'fs'
import pino from 'pino'
import crypto from 'crypto'
import NodeCache from 'node-cache'
import { makeWASocket } from '../lib/simple.js'

export async function serbot(m, { conn, args, usedPrefix, command }) {
  // Define el bot principal que va a enviar mensajes de QR
  let parentw = args[0] === 'plz' ? conn : global.conn

  // Solo se puede usar desde el bot principal
  if (!(args[0] === 'plz' || global.conn.user.jid === conn.user.jid)) {
    return m.reply("Este comando solo puede ser usado en el bot principal! wa.me/" + global.conn.user.jid.split`@`[0] + "?text=" + usedPrefix + "serbot")
  }

  // Carpeta de sesión para el sub bot
  let serbotFolder = crypto.randomBytes(10).toString('hex').slice(0, 8)
  let folderSub = `./sessions/${serbotFolder}`
  if (!fs.existsSync(folderSub)) fs.mkdirSync(folderSub, { recursive: true })

  // Si recibimos credenciales base64 desde args[0]
  if (args[0]) {
    fs.writeFileSync(`${folderSub}/creds.json`, Buffer.from(args[0], 'base64').toString('utf-8'))
  }

  const { state, saveCreds } = await useMultiFileAuthState(folderSub)
  const { version } = await fetchLatestBaileysVersion()
  const msgRetryCounterCache = new NodeCache()

  // Configuración de conexión DS6 Meta
  const connOptions = {
    logger: pino({ level: 'silent' }),
    printQRInTerminal: true,
    browser: ['Sumi Sakursawa', 'Safari', '2.0.0'],
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' }).child({ level: 'fatal' })),
    },
    markOnlineOnConnect: true,
    generateHighQualityLinkPreview: true,
    msgRetryCounterCache,
    version
  }

  let subConn = makeWASocket(connOptions)
  subConn.isInit = false

  // Evento de conexión
  subConn.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr, isNewLogin } = update

    if (qr) {
      const qrDataUrl = await qrcode.toDataURL(qr, { scale: 8 })
      let txt = '`🧃 S E R B O T - S U B B O T`\n\nEscanea este QR en tu dispositivo sub bot.\nExpira en 30s.'
      let sendQR = await parentw.sendFile(m.chat, qrDataUrl, 'qrcode.png', txt, m)
      setTimeout(() => parentw.sendMessage(m.chat, { delete: sendQR.key }), 30000)
    }

    if (connection === 'open') {
      subConn.isInit = true
      if (!global.conns.includes(subConn)) global.conns.push(subConn)

      await parentw.reply(m.chat, 'Sub bot conectado correctamente! Este bot ahora reconoce comandos automáticamente.', m)
      await saveCreds()
    }

    // Manejo de desconexión
    if (lastDisconnect?.error) {
      const code = lastDisconnect.error.output?.statusCode
      if (code && code !== DisconnectReason.loggedOut) {
        const i = global.conns.indexOf(subConn)
        if (i >= 0) global.conns.splice(i, 1)
        await parentw.reply(m.chat, 'Sub bot desconectado, intentando reconectar...', m)
      }
    }
  })

  // DS6 Meta ya maneja automáticamente los mensajes, no necesitas bind manual
}