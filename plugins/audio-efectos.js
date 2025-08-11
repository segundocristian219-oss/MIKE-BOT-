import { unlinkSync, readFileSync } from 'fs'
import { join } from 'path'
import { exec } from 'child_process'

let handler = async (m, { conn, __dirname, command, usedPrefix }) => {
  try {
    // Obtener el mensaje citado o el mismo mensaje
    let q = m.quoted ? m.quoted : m
    // Obtener el mimetype para verificar que es audio
    let mime = q.msg?.audioMessage ? 'audio' : (q.msg?.voiceMessage ? 'audio' : '')
    
    // Definir filtro según comando
    let set = ''
    if (/bass/.test(command)) set = '-af equalizer=f=94:width_type=o:width=2:g=30'
    else if (/blown/.test(command)) set = '-af acrusher=.1:1:64:0:log'
    else if (/deep/.test(command)) set = '-af atempo=4/4,asetrate=44500*2/3'
    else if (/earrape/.test(command)) set = '-af volume=12'
    else if (/fast/.test(command)) set = '-filter:a "atempo=1.63,asetrate=44100"'
    else if (/fat/.test(command)) set = '-filter:a "atempo=1.6,asetrate=22100"'
    else if (/nightcore/.test(command)) set = '-filter:a atempo=1.06,asetrate=44100*1.25'
    else if (/reverse/.test(command)) set = '-filter_complex "areverse"'
    else if (/robot/.test(command)) set = '-filter_complex "afftfilt=real=\'hypot(re,im)*sin(0)\':imag=\'hypot(re,im)*cos(0)\':win_size=512:overlap=0.75"'
    else if (/slow/.test(command)) set = '-filter:a "atempo=0.7,asetrate=44100"'
    else if (/smooth/.test(command)) set = '-filter:v "minterpolate=\'mi_mode=mci:mc_mode=aobmc:vsbmc=1:fps=120\'"'
    else if (/tupai|squirrel|chipmunk/.test(command)) set = '-filter:a "atempo=0.5,asetrate=65100"'
    
    if (mime !== 'audio') {
      return await m.reply(`❗️ Por favor responde a un audio o nota de voz para usar este comando.\nEjemplo: ${usedPrefix + command}`)
    }
    
    // Descargar audio original
    let media = await q.download()
    if (!media) return await m.reply('❗️ No pude descargar el audio, intenta otra vez.')
    
    // Crear ruta para archivo temporal de salida
    let ran = `${Date.now()}.mp3`
    let filename = join(__dirname, '../tmp/' + ran)
    
    // Ejecutar ffmpeg para aplicar filtro
    exec(`ffmpeg -i "${media}" ${set} "${filename}"`, async (error) => {
      // Borrar archivo descargado original
      try { unlinkSync(media) } catch {}
      
      if (error) {
        console.error(error)
        return await m.reply('❗️ Error al procesar el audio.')
      }
      
      // Leer archivo procesado
      let buffer = readFileSync(filename)
      
      // Enviar nota de voz (ptt: true), sin citar (sin reply)
      await conn.sendMessage(m.chat, buffer, 'audioMessage', { ptt: true })
      
      // Borrar archivo temporal procesado
      try { unlinkSync(filename) } catch {}
    })
    
  } catch (e) {
    console.error(e)
    await m.reply('❗️ Ocurrió un error inesperado.')
  }
}

handler.help = ['bass', 'blown', 'deep', 'earrape', 'fast', 'fat', 'nightcore', 'reverse', 'robot', 'slow', 'smooth', 'tupai'].map(v => v + ' [vn]')
handler.tags = ['audio']
handler.command = /^(bass|blown|deep|earrape|fas?t|nightcore|reverse|robot|slow|smooth|tupai|squirrel|chipmunk)$/i

export default handler