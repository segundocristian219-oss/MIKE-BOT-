// _sticker-listener.js
const fs = require("fs");
const path = require("path");

module.exports = async function stickerListener(msg, conn) {
  const quoted = msg.message?.stickerMessage;
  if (!quoted) return;

  let fileSha = null;
  if (quoted.fileSha256) {
    fileSha = Buffer.from(quoted.fileSha256).toString("base64");
  } else if (quoted.fileEncSha256) {
    fileSha = Buffer.from(quoted.fileEncSha256).toString("base64");
  }

  if (!fileSha) return;

  const jsonPath = path.resolve("./comandos.json");
  if (!fs.existsSync(jsonPath)) return;
  const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

  const comando = data[fileSha];
  if (!comando) return;

  // ⚡ fake mensaje con texto normal
  const fakeMsg = {
    ...msg,
    message: {
      conversation: comando // 👈 ahora sí parece texto normal
    },
    text: comando
  };

  // reinyectar para que lo procese tu handler
  conn.ev.emit("messages.upsert", { messages: [fakeMsg], type: "notify" });
};