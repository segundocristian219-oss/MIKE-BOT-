let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`📥 *Uso correcto:* ${usedPrefix + command} <nombre o link de YouTube>`)

  const fetch = await import('node-fetch').then(m => m.default || m)

  // Buscar video por nombre (si no es link)
  let ytLink = ''
  if (!text.includes('youtube.com') && !text.includes('youtu.be')) {
    try {
      let search = await fetch(`https://aemt.me/yts?query=${encodeURIComponent(text)}`).then(res => res.json())
      if (!search?.data || !search.data[0]) return m.reply('❌ No se encontraron resultados.')

      ytLink = `https://www.youtube.com/watch?v=${search.data[0].id}`
    } catch {
      return m.reply('❌ Error al buscar el video.')
    }
  } else {
    ytLink = text
  }

  // Usamos la API de Vihangayt
  let apiURL = `https://vihangayt.me/tools/ytdl?url=${encodeURIComponent(ytLink)}`
  let res = await fetch(apiURL)
  if (!res.ok) return m.reply('❌ Error al acceder a la API.')
  let json = await res.json()

  if (!json?.data?.videoUrl?.url) return m.reply('⚠️ No se pudo obtener el video.')

  let video = json.data
  let title = video.title
  let dl_url = video.videoUrl.url
  let size = video.videoUrl.size

  let caption = `🎬 *Título:* ${title}\n📦 *Tamaño:* ${size}\n🔗 *Link:* ${ytLink}`

  await conn.sendFile(m.chat, dl_url, title + '.mp4', caption, m)
}

handler.command = /^play$/i
export default handler