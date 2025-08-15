let handler = async (m, { conn }) => {
  const lower = m.text.toLowerCase();

  let isClose = {
    abrir: "not_announcement",
    cerrar: "announcement",
    "grupo abrir": "not_announcement",
    "grupo cerrar": "announcement",
    open: "not_announcement",
    close: "announcement",
    ".abrir": "not_announcement",
    ".cerrar": "announcement",
    ".grupo abrir": "not_announcement",
    ".grupo cerrar": "announcement",
    ".open": "not_announcement",
    ".close": "announcement",
    ".grupo open": "not_announcement",
    ".grupo close": "announcement"
  }[lower];

  if (!isClose) return;

  await conn.groupSettingUpdate(m.chat, isClose);

  // Reacciona con ✅ cuando se complete la acción
  await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
};

handler.customPrefix = /^(?:\.?grupo\s(?:abrir|cerrar|open|close)|\.?(?:abrir|cerrar|open|close))$/i;
handler.command = new RegExp; // sin prefijo
handler.admin = true;
handler.botAdmin = true;
handler.group = true;

export default handler;