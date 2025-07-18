import fs from "fs"
import path from "path"
import fetch from "node-fetch"
import Jimp from "jimp"
import FormData from "form-data"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const handler = async (m, { conn }) => {
  try {
    const q = m.quoted || m
    const mime = (q.msg || q).mimetype || q.mediaType || ""

    if (!/^image\/(jpe?g|png)$/.test(mime)) {
      return m.reply("🪐 𝗥𝗲𝘀𝗽𝗼𝗻𝗱𝗲 𝗮 𝘂𝗻𝗮 𝗶𝗺𝗮𝗴𝗲𝗻 𝗷𝗽𝗴 𝗼 𝗽𝗻𝗴 🍷.")
    }

    // Reacciona con ⌛ mientras procesa
    await conn.sendMessage(m.chat, { react: { text: "⌛", key: m.key } })

    const buffer = await q.download()
    const image = await Jimp.read(buffer)
    image.resize(800, Jimp.AUTO)

    const tmp = path.join(__dirname, `tmp_${Date.now()}.jpg`)
    await image.writeAsync(tmp)

    const uploadedUrl = await uploadToUguu(tmp)
    if (!uploadedUrl) throw new Error('❌ 𝗙𝗮𝗹𝗹ó 𝗹𝗮 𝘀𝘂𝗯𝗶𝗱𝗮 𝗮 𝗹𝗮 𝗔𝗣𝗜.')

    const enhancedBuffer = await upscaleImage(uploadedUrl)

    await conn.sendFile(m.chat, enhancedBuffer, 'imagen-hd.jpg', '', m)

    // Reacciona con ✅ al terminar
    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } })

  } catch (err) {
    console.error(err)
    m.reply(`❌ *Error:* ${err.message}`)
  }
}

handler.help = ['upscale']
handler.tags = ['tools']
handler.command = ['hd', 'remini', 'upscale']
handler.register = true

export default handler

// Subir imagen a uguu.se
async function uploadToUguu(filePath) {
  const form = new FormData()
  form.append("files[]", fs.createReadStream(filePath))

  try {
    const res = await fetch("https://uguu.se/upload.php", {
      method: "POST",
      headers: form.getHeaders(),
      body: form
    })

    const json = await res.json()
    await fs.promises.unlink(filePath)
    return json.files?.[0]?.url
  } catch (e) {
    await fs.promises.unlink(filePath)
    console.error("Error al subir a uguu:", e)
    return null
  }
}

// Usar API para mejorar la imagen
async function upscaleImage(url) {
  const res = await fetch(`https://api.siputzx.my.id/api/iloveimg/upscale?image=${encodeURIComponent(url)}`)
  if (!res.ok) throw new Error("❌ No se pudo mejorar la imagen.")
  return await res.buffer()
}