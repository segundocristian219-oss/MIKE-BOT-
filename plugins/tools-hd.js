import fs from "fs"
import path from "path"
import fetch from "node-fetch"
import Jimp from "jimp"
import FormData from "form-data"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const handler = async (m, { conn }) => {
  const dev = "Bot zzz 🍷" // Puedes personalizar este nombre

  try {
    const q = m.quoted || m
    const mime = (q.msg || q).mimetype || q.mediaType || ""

    if (!/^image\/(jpe?g|png)$/.test(mime)) {
      return m.reply("🪐 𝗥𝗲𝘀𝗽𝗼𝗻𝗱𝗲 𝗮 𝘂𝗻𝗮 𝗶𝗺𝗮𝗴𝗲𝗻 𝗷𝗽𝗴 𝗼 𝗽𝗻𝗴 🍷.")
    }

    await conn.sendMessage(m.chat, { text: `⏳ 𝗠𝗲𝗷𝗼𝗿𝗮𝗻𝗱𝗼 𝘁𝘂 𝗶𝗺𝗮𝗴𝗲𝗻... 𝗲𝘀𝗽𝗲𝗿𝗮 🍷\n> ${dev}` }, { quoted: m })

    const buffer = await q.download()
    const image = await Jimp.read(buffer)
    image.resize(800, Jimp.AUTO)

    const tmp = path.join(__dirname, `tmp_${Date.now()}.jpg`)
    await image.writeAsync(tmp)

    const uploadedUrl = await uploadToUguu(tmp)
    if (!uploadedUrl) throw new Error('❌ 𝗟𝗮 𝗔𝗣𝗜 𝗳𝗮𝗹𝗹ó 𝗲𝗻 𝘀𝘂𝗯𝗶𝗿 𝗹𝗮 𝗶𝗺𝗮𝗴𝗲𝗻 🍷.')

    const enhancedBuffer = await upscaleImage(uploadedUrl)

    await conn.sendFile(m.chat, enhancedBuffer, 'imagen-hd.jpg', '', m)
    await conn.sendMessage(m.chat, { text: "✅ 𝗜𝗺𝗮𝗴𝗲𝗻 𝗺𝗲𝗷𝗼𝗿𝗮𝗱𝗮 𝗰𝗼𝗻 é𝘅𝗶𝘁𝗼 🍷." }, { quoted: m })

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

// Función para subir imagen a uguu
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
    console.error("Error subiendo a uguu:", e)
    return null
  }
}

// Función para mejorar la imagen con API externa
async function upscaleImage(url) {
  const res = await fetch(`https://api.siputzx.my.id/api/iloveimg/upscale?image=${encodeURIComponent(url)}`)
  if (!res.ok) throw new Error("❌ No se pudo mejorar la imagen.")
  return await res.buffer()
}