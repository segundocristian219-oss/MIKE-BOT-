import fs from "fs"
import path from "path"
import crypto from "crypto"
import { downloadContentFromMessage } from "@whiskeysockets/baileys"

const handler = async (msg, { conn, args }) => {
  const chatId = msg.key.remoteJid
  const isGroup = chatId.endsWith("@g.us")
  const senderId = msg.key.participant || msg.key.remoteJid
  const senderNum = senderId.replace(/[^0-9]/g, "")
  const isOwner = global.owner.some(([id]) => id === senderNum)
  const isFromMe = msg.key.fromMe

  // 🛡️ Verificación de permisos
  if (isGroup && !isOwner && !isFromMe) {
    const metadata = await conn.groupMetadata(chatId)
    const participant = metadata.participants.find(p => p.id === senderId)
    const isAdmin = participant?.admin === "admin" || participant?.admin === "superadmin"
    if (!isAdmin) {
      return conn.sendMessage(chatId, {
        text: "🚫 *Solo los administradores, el owner o el bot pueden usar este comando.*"
      }, { quoted: msg })
    }
  } else if (!isGroup && !isOwner && !isFromMe) {
    return conn.sendMessage(chatId, {
      text: "🚫 *Solo el owner o el mismo bot pueden usar este comando en privado.*"
    }, { quoted: msg })
  }

  // 🖼️ Verifica que se responda a un sticker
  const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage
  if (!quoted?.stickerMessage) {
    return conn.sendMessage(chatId, {
      text: "❌ *Responde a un sticker para asignarle un comando.*"
    }, { quoted: msg })
  }

  const comando = args.join(" ").trim()
  if (!comando) {
    return conn.sendMessage(chatId, {
      text: "⚠️ *Especifica el comando a asignar. Ejemplo:* .addco kick"
    }, { quoted: msg })
  }

  // 🔑 Obtener hash único del sticker en formato "array de bytes string"
  let fileSha = null
  try {
    const stream = await downloadContentFromMessage(quoted.stickerMessage, "sticker")
    let buffer = Buffer.from([])
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk])
    }
    // digest en binario y luego pasamos a array.join(",")
    const hashBuffer = crypto.createHash("sha256").update(buffer).digest()
    fileSha = hashBuffer.toJSON().data.join(",")
  } catch (e) {
    return conn.sendMessage(chatId, {
      text: "❌ *No se pudo procesar el sticker.*"
    }, { quoted: msg })
  }

  // 📂 Guardar en comandos.json
  const jsonPath = path.resolve("./comandos.json")
  const data = fs.existsSync(jsonPath)
    ? JSON.parse(fs.readFileSync(jsonPath, "utf-8"))
    : {}

  data[fileSha] = comando
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2))

  await conn.sendMessage(chatId, {
    react: { text: "✅", key: msg.key }
  })

  return conn.sendMessage(chatId, {
    text: `✅ *Sticker vinculado al comando con éxito:* \`${comando}\``,
    quoted: msg
  })
}

handler.command = ["addco"]
handler.tags = ["tools"]
handler.help = ["addco <comando>"]

export default handler