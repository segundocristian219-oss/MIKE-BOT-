// plugins/stickerListener.js
import fs from "fs"
import path from "path"

export default function stickerListener(conn){
  const jsonPath = path.resolve("./comandos.json")
  let comandos = {}
  if (fs.existsSync(jsonPath)) {
    try{comandos = JSON.parse(fs.readFileSync(jsonPath,"utf-8"))}catch{}
  }

  conn.ev.on("messages.upsert", async ({messages})=>{
    for(const m of messages){
      const sticker = m.message?.stickerMessage
      if(!sticker) continue

      const stickerId = sticker.url || sticker.fileName || JSON.stringify(sticker)
      const comando = comandos[stickerId]
      if(!comando) continue

      // inyecta comando
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