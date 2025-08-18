const {
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion, 
    MessageRetryMap,
    makeCacheableSignalKeyStore, 
    jidNormalizedUser,
    PHONENUMBER_MCC
   } = await import('@whiskeysockets/baileys')
import moment from 'moment-timezone'
import NodeCache from 'node-cache'
import crypto from 'crypto'
import fs from "fs"
import pino from 'pino';
import * as ws from 'ws';
const { CONNECTING } = ws
import { Boom } from '@hapi/boom'
import { makeWASocket } from '../lib/simple.js';

if (global.conns instanceof Array) console.log()
else global.conns = []

let handler = async (m, { conn: _conn, args, usedPrefix, command, isOwner }) => {
  let parent = args[0] && args[0] == 'plz' ? _conn : await global.conn
  if (!((args[0] && args[0] == 'plz') || (await global.conn).user.jid == _conn.user.jid)) {
        return m.reply(`Este comando solo puede ser usado en el bot principal! wa.me/${global.conn.user.jid.split`@`[0]}?text=${usedPrefix}code`)
  }

  async function serbot() {
    let authFolderB = crypto.randomBytes(10).toString('hex').slice(0, 8)

    if (!fs.existsSync("./serbot/"+ authFolderB)){
        fs.mkdirSync("./serbot/"+ authFolderB, { recursive: true });
    }
    args[1] ? fs.writeFileSync("./serbot/" + authFolderB + "/creds.json", JSON.stringify(JSON.parse(Buffer.from(args[1], "base64").toString("utf-8")), null, '\t')) : ""

    const {state, saveCreds} = await useMultiFileAuthState(`./serbot/${authFolderB}`)
    const msgRetryCounterMap = (MessageRetryMap) => { };
    const msgRetryCounterCache = new NodeCache()
    const {version} = await fetchLatestBaileysVersion();

    const connectionOptions = {
      logger: pino({ level: 'silent' }),
      printQRInTerminal: false,
      mobile: false, 
      browser: [ "Ubuntu", "Chrome", "20.0.04" ], 
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
      },
      markOnlineOnConnect: true, 
      generateHighQualityLinkPreview: true, 
      msgRetryCounterCache,
      msgRetryCounterMap,
      defaultQueryTimeoutMs: undefined,   
      version
    }

    let conn = makeWASocket(connectionOptions)

    // ⚡ Aquí pedimos el número en el comando: .code 5215512345678
    if (!conn.authState.creds.registered) {
        let phoneNumber = args[0] || ""  
        if (!phoneNumber) {
            return parent.reply(m.chat, `⚠️ Debes escribir tu número\n\nEjemplo:\n*.code 5215512345678*`, m);
        }

        let cleanedNumber = phoneNumber.replace(/[^0-9]/g, '');
        if (!Object.keys(PHONENUMBER_MCC).some(v => cleanedNumber.startsWith(v))) {
            return parent.reply(m.chat, "❌ El número no es válido para WhatsApp", m);
        }

        try {
            let codeBot = await conn.requestPairingCode(cleanedNumber);
            codeBot = codeBot?.match(/.{1,4}/g)?.join("-") || codeBot;

            let txt = `–  *S E R B O T  -  S U B B O T*\n\n`
            txt += `┌  ✩  *Usa este Código para convertirte en un Sub Bot*\n`
            txt += `│  ✩  *1* : Abre WhatsApp > Dispositivos vinculados\n`
            txt += `│  ✩  *2* : Selecciona *Vincular con el número de teléfono*\n`
            txt += `└  ✩  *3* : Ingresa este código:\n\n`
            txt += `👉  *${codeBot}*\n\n`
            txt += `*Nota:* Solo funciona en el número que lo solicitó`

            await parent.sendMessage(m.chat, { text: txt }, { quoted: m });
        } catch (e) {
            console.error(e);
            parent.reply(m.chat, "❌ Error al generar el código", m);
        }
    }

    conn.isInit = false
    let isInit = true

    async function connectionUpdate(update) {
        const { connection, lastDisconnect, isNewLogin } = update
        if (isNewLogin) conn.isInit = true
        const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode;
        if (code && code !== DisconnectReason.loggedOut && conn?.ws.socket == null) {
            let i = global.conns.indexOf(conn)
            if (i < 0) return console.log(await creloadHandler(true).catch(console.error))
            delete global.conns[i]
            global.conns.splice(i, 1)

            if (code !== DisconnectReason.connectionClosed) {
                parent.sendMessage(m.chat, { text: "Conexión perdida.." }, { quoted: m })
            }
        }

        if (global.db.data == null) loadDatabase()

        if (connection == 'open') {
            conn.isInit = true
            global.conns.push(conn)
            await parent.reply(m.chat, args[0] ? 'Conectado con éxito' : 'Conectado exitosamente con WhatsApp\n\n*Nota:* Esto es temporal\nSi el Bot principal se reinicia o se desactiva, todos los sub bots también lo harán\n\nEl número del bot puede cambiar, guarda este enlace:\n*-* https://whatsapp.com/channel/0029VaBfsIwGk1FyaqFcK91S', m)
            await sleep(5000)
        }
    }

    setInterval(async () => {
        if (!conn.user) {
            try { conn.ws.close() } catch { }
            conn.ev.removeAllListeners()
            let i = global.conns.indexOf(conn)
            if (i < 0) return
            delete global.conns[i]
            global.conns.splice(i, 1)
        }}, 60000)

    let handler = await import('../handler.js')
    let creloadHandler = async function (restatConn) {
        try {
            const Handler = await import(`../handler.js?update=${Date.now()}`).catch(console.error)
            if (Object.keys(Handler || {}).length) handler = Handler
        } catch (e) {
            console.error(e)
        }
        if (restatConn) {
            try { conn.ws.close() } catch { }
            conn.ev.removeAllListeners()
            conn = makeWASocket(connectionOptions)
            isInit = true
        }

        if (!isInit) {
            conn.ev.off('messages.upsert', conn.handler)
            conn.ev.off('connection.update', conn.connectionUpdate)
            conn.ev.off('creds.update', conn.credsUpdate)
        }

        conn.handler = handler.handler.bind(conn)
        conn.connectionUpdate = connectionUpdate.bind(conn)
        conn.credsUpdate = saveCreds.bind(conn, true)

        conn.ev.on('messages.upsert', conn.handler)
        conn.ev.on('connection.update', conn.connectionUpdate)
        conn.ev.on('creds.update', conn.credsUpdate)
        isInit = false
        return true
    }
    creloadHandler(false)
  }
  serbot()
}
handler.help = ['code']
handler.tags = ['serbot']
handler.command = ['code']
handler.rowner = false

export default handler

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}