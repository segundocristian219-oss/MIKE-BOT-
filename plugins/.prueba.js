// plugins/_sticker-listener.js
import fs from "fs"
import path from "path"

export async function before(msg, { conn }) {
  if (!msg.message?.stickerMessage) return

  const sticker = msg.message.stickerMessage

  // 🔑 Sacar hash en base64 igual que en addco
  let fileSha = null
  if (sticker.fileSha256) {
    fileSha = Buffer.from(sticker.fileSha256).toString("base64")
  } else if (sticker.fileEncSha256) {
    fileSha = Buffer.from(sticker.fileEncSha256).toString("base64")
  }

  if (!fileSha) return

  // 📂 Cargar comandos.json
  const jsonPath = path.resolve("./comandos.json")
  if (!fs.existsSync(jsonPath)) return
  const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"))

  // 🚀 Si el sticker está registrado, ejecutar el comando
  if (data[fileSha]) {
    const fakeMsg = {
      ...msg,
      text: data[fileSha], // ⚡ el comando que guardaste en addco
      body: data[fileSha],
    }
    conn.emit("messages.upsert", {
      messages: [fakeMsg],
      type: "notify"
    })
  }
}