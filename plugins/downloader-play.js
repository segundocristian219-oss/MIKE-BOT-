let handler = async (m, { conn, text, args, usedPrefix, command }) => {
  if (!text) return m.reply(`🚫 *Debes escribir el nombre de una canción o video para buscar.*\n\n📌 Uso: ${usedPrefix + command} <título o link>`)

  const fetch = await import('node-fetch').then(m => m.default || m)

  const apis = [
    url => `https://api.siputzx.my.id/api/d/ytmp4?url=${url}`,
    url => `https://api.zenkey.my.id/api/download/ytmp4?apikey=zenkey&url=${url}`,
    url => `https://axeel.my.id/api/download/video?url=${encodeURIComponent(url)}`,
    url => `https://delirius-apiofc.vercel.app/download/ytmp4?url=${url}`
  ]

  const ytSearch = await fetch(`https://aemt.me/yts?query=${encodeURIComponent(text)}`)
    .then(res => res.json()).catch(() => null)

  if (!ytSearch?.data || !ytSearch.data[0]) return m.reply('❌ No se encontraron resultados.')

  const video = ytSearch.data[0]
  const videoUrl = `https://www.youtube.com/watch?v=${video.id}`

  let result, success = false

  for (let api of apis) {
    try {
      const res = await fetch(api(videoUrl))
      const json = await res.json()
      if (json?.url || json?.result?.url) {
        result = json.url || json.result.url
        success = true
        break
      }
    } catch (e) {
      continue
    }
  }

  if (!success) return m.reply('⚠️ Todas las fuentes fallaron, intenta más tarde.')

  let caption = `📽 *Título:* ${video.title}\n📊 *Vistas:* ${video.views}\n⏱ *Duración:* ${video.timestamp}\n🔗 *Link:* ${videoUrl}`

  await conn.sendFile(m.chat, result, video.title + '.mp4', caption, m)
}

handler.command = /^play$/i
export default handler