// plugins/stickerCommand.js
import fs from "fs"
import path from "path"
import crypto from "crypto"
import { downloadContentFromMessage } from "@whiskeysockets/baileys"

let comandos = {}
const jsonPath = path.resolve("./comandos.json")

if (fs.existsSync(jsonPath)) {
  try {
    comandos = JSON.parse(fs.readFileSync(jsonPath, "utf-8"))
  } catch {
    comandos = {}
  }
}

const stickerCommand = async (m, { conn }) => {
  if (!m.message?.stickerMessage) return

  try {
    const stream = await downloadContentFromMessage(m.message.stickerMessage, "sticker")
    let buffer = Buffer.from([])
    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk])
    const hashBuffer = crypto.createHash("sha256").update(buffer).digest()
    const fileSha = hashBuffer.toJSON().data.join(",")

    const comando = comandos[fileSha]
    if (!comando) return

    // 👇 Esto es lo que reinjecta el comando como si lo escribieras
    conn.emit("messages.upsert", {
      messages: [
        {
          key: m.key,
          message: { conversation: `.${comando}` },
          pushName: m.pushName,
          messageTimestamp: Date.now() / 1000,
        },
      ],
      type: "notify",
    })
  } catch (e) {
    console.error("Error leyendo sticker:", e)
  }
}

export default stickerCommand