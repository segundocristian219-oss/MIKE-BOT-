let handler = async (m, { conn }) => {
  await conn.sendMessage(m.chat, {
    text: "Menú de opciones 👇",
    footer: "DS6 Meta Bot",
    title: "Botones disponibles",
    buttonText: "Abrir menú",
    sections: [
      {
        title: "Opciones principales",
        rows: [
          { title: "👤 Owner", rowId: ".owner" },
          { title: "📜 Menú", rowId: ".menu" },
          { title: "⚙️ Configuración", rowId: ".config" }
        ]
      }
    ]
  }, { quoted: m })
}

handler.command = /^botones$/i
export default handler