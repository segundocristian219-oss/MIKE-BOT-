let handler = async (m, { conn }) => {
  // Normalizar texto: quitar punto inicial si existe y pasar a minúsculas
  const cmd = m.text.replace(/^\./, "").toLowerCase()

  // Comandos válidos
  const commandsMap = {
    abrir: "not_announcement",
    cerrar: "announcement",
    "grupo abrir": "not_announcement",
    "grupo cerrar": "announcement",
    open: "not_announcement",
    close: "announcement",
    "grupo open": "not_announcement",
    "grupo close": "announcement",
  }

  const isClose = commandsMap[cmd]
  if (!isClose) return

  await conn.groupSettingUpdate(m.chat, isClose)
  m.reply("☁️ 𝘎𝘳𝘶𝘱𝘰 𝘊𝘰𝘯𝘧𝘪𝘨𝘶𝘳𝘢𝘥𝘰 𝘊𝘰𝘳𝘳𝘦𝘤𝘵𝘢𝘮𝘦𝘯𝘵𝘦")
}

// Prefijo personalizado: se usa solo para detectar sin punto ni prefijo especial
handler.customPrefix = /^(grupo\s(abrir|cerrar|open|close)|abrir|cerrar|open|close)$/i

// Permitir comando sin prefijo
handler.command = new RegExp

handler.admin = true     // Solo admins
handler.botAdmin = true  // El bot debe ser admin
handler.group = true     // Solo en grupos

export default handler