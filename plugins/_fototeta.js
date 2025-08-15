// plugins/stickercomandos.js
import fs from "fs";
import path from "path";

let handler = m => m;

handler.all = async function (msg) {
  const sticker = msg.message?.stickerMessage;
  if (!sticker) return;

  const fileSha = sticker.fileSha256?.toString("base64");
  if (!fileSha) return;

  const jsonPath = path.resolve("./comandos.json");
  if (!fs.existsSync(jsonPath)) return;

  const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
  const comando = data[fileSha];
  if (!comando) return;

  // Prefijo configurable del bot
  const prefix = global.prefix || ".";
  msg.text = `${prefix}${comando}`;

  // Reenviar como si fuera mensaje nuevo
  this.emit("messages.upsert", {
    messages: [msg],
    type: "notify"
  });
};

export default handler;