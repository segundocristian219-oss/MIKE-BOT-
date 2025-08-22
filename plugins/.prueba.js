// plugins/stickerCommand.js
import fs from "fs"
import path from "path"
import crypto from "crypto"
import { downloadContentFromMessage } from "@whiskeysockets/baileys"

async function stickerCommand(m, { conn }) {
  const sticker = m.message?.stickerMessage
  if (!sticker) return

  const jsonPath = path.resolve("./comandos.json")
  if (!fs.existsSync(jsonPath)) return
  const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"))

  // 🔑 Hash del sticker
  let fileSha = null
  try {
    const stream = await downloadContentFromMessage(sticker, "sticker")
    let buffer = Buffer.from([])
    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk])
    const hashBuffer = crypto.createHash("sha256").update(buffer).digest()
    fileSha = hashBuffer.toJSON().data.join(",")
  } catch {
    return
  }

  const comando = data[fileSha]
  if (!comando) return

  // 🚀 Inyectar como mensaje de texto
  const fakeMsg = {
    ...m,
    text: `.${comando}`,
    message: { conversation: `.${comando}` }
  }

  conn.emit("messages.upsert", { messages: [fakeMsg], type: "notify" })
}

// 🟢 ESTE DETALLE ES LO IMPORTANTE EN DS6:
export default {
  all: stickerCommand
}