// plugins/stickerCommand.js
import fs from "fs"
import path from "path"
import crypto from "crypto"
import { downloadContentFromMessage } from "@whiskeysockets/baileys"

const handler = async (msg, { conn }) => {
  // 🖼️ Solo responder a stickers
  const sticker = msg.message?.stickerMessage
  if (!sticker) return

  // 📂 Cargar base de datos
  const jsonPath = path.resolve("./comandos.json")
  if (!fs.existsSync(jsonPath)) return
  const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"))

  // 🔑 Calcular hash igual que en addco (array de bytes string)
  let fileSha = null
  try {
    const stream = await downloadContentFromMessage(sticker, "sticker")
    let buffer = Buffer.from([])
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk])
    }
    const hashBuffer = crypto.createHash("sha256").update(buffer).digest()
    fileSha = hashBuffer.toJSON().data.join(",")
  } catch (e) {
    return
  }

  // 📌 Buscar comando
  const comando = data[fileSha]
  if (!comando) return

  // 🚀 Simular mensaje de texto con el comando
  const fakeMsg = {
    ...msg,
    text: `.${comando}`, // 👉 cambia el prefijo si usas otro
    message: {
      conversation: `.${comando}`
    }
  }

  // Emitir como si lo hubiera escrito el usuario
  conn.emit("messages.upsert", { messages: [fakeMsg], type: "notify" })
}

export default handler