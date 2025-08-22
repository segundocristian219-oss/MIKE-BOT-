// plugins/addco.js
import fs from "fs"
import path from "path"
import crypto from "crypto"
import { downloadContentFromMessage } from "@whiskeysockets/baileys"

const handler = async (msg, { conn, args }) => {
  const chatId = msg.key.remoteJid
  const senderId = msg.key.participant || msg.key.remoteJid
  const isOwner = global.owner.some(([id]) => id === senderId.replace(/[^0-9]/g,""))
  const isFromMe = msg.key.fromMe

  // permisos
  if (!isOwner && !isFromMe) return conn.sendMessage(chatId,{text:"🚫 Solo owner o bot"},{quoted:msg})

  // sticker citado
  const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage
  if (!quoted?.stickerMessage) return conn.sendMessage(chatId,{text:"❌ Responde a un sticker"},{quoted:msg})

  const comando = args.join(" ").trim()
  if (!comando) return conn.sendMessage(chatId,{text:"⚠️ Especifica el comando"},{quoted:msg})

  // descargar sticker y hash
  let fileSha
  try {
    const stream = await downloadContentFromMessage(quoted.stickerMessage, "sticker")
    let buffer = Buffer.from([])
    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk])
    fileSha = crypto.createHash("sha256").update(buffer).digest().toJSON().data.join(",")
  } catch {
    return conn.sendMessage(chatId,{text:"❌ No se pudo procesar el sticker"},{quoted:msg})
  }

  // guardar
  const jsonPath = path.resolve("./comandos.json")
  const data = fs.existsSync(jsonPath)?JSON.parse(fs.readFileSync(jsonPath,"utf-8")):{}
  data[fileSha] = comando
  fs.writeFileSync(jsonPath,JSON.stringify(data,null,2))

  await conn.sendMessage(chatId,{react:{text:"✅",key:msg.key}})
  return conn.sendMessage(chatId,{text:`✅ Sticker vinculado: \`${comando}\``},{quoted:msg})
}

handler.command = ["addco"]
handler.tags = ["tools"]
handler.help = ["addco <comando>"]
export default handler