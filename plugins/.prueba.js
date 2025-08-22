// plugins/stickerListener.js
import fs from "fs"
import path from "path"
import crypto from "crypto"
import { downloadContentFromMessage } from "@whiskeysockets/baileys"

export default function stickerListener(conn){
  const jsonPath = path.resolve("./comandos.json")
  let comandos = {}
  if (fs.existsSync(jsonPath)) {
    try{comandos = JSON.parse(fs.readFileSync(jsonPath,"utf-8"))}catch{}
  }

  conn.ev.on("messages.upsert", async ({messages})=>{
    for(const m of messages){
      if(!m.message?.stickerMessage) continue

      let fileSha
      try{
        const stream = await downloadContentFromMessage(m.message.stickerMessage, "sticker")
        let buffer = Buffer.from([])
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk])
        fileSha = crypto.createHash("sha256").update(buffer).digest().toJSON().data.join(",")
      }catch{continue}

      const comando = comandos[fileSha]
      if(!comando) continue

      // inyecta mensaje como si se hubiera escrito
      conn.emit("messages.upsert",{
        messages:[{
          key:m.key,
          message:{conversation:`.${comando}`},
          pushName:m.pushName,
          messageTimestamp:Math.floor(Date.now()/1000)
        }],
        type:"notify"
      })
    }
  })
}