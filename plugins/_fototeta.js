// plugins/stickercomandos.js
import fs from "fs";
import path from "path";

const handler = async (msg, { conn }) => {
  // Solo continuar si es un sticker
  const sticker = msg.message?.stickerMessage;
  if (!sticker) return;

  // Obtener hash único del sticker
  const fileSha = sticker.fileSha256?.toString("base64");
  if (!fileSha) return;

  // Ruta del archivo de comandos guardados
  const jsonPath = path.resolve("./comandos.json");
  if (!fs.existsSync(jsonPath)) return;

  // Leer comandos registrados
  const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
  const comando = data[fileSha];
  if (!comando) return; // Si no hay comando vinculado, salir

  // Modificar el mensaje para simular que el usuario lo escribió
  msg.text = `.${comando}`;

  // Volver a enviar el mensaje al sistema de handlers del bot
  conn.emit("messages.upsert", {
    messages: [msg],
    type: "notify"
  });
};

export default handler;