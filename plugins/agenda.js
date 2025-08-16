import axios from 'axios';

const API_KEY = 'TU_API_KEY_DE_NENCER';

async function fetchWeeklyEvents() {
  const res = await axios.get('https://api.nencer.vn/ff/events', {
    params: { api_key: API_KEY }
  });
  if (!res.data || !res.data.data) throw 'No se pudo obtener la agenda semanal';
  return res.data.data.events; // ajusta según la estructura real
}

let handler = async (m, { conn }) => {
  try {
    // Bloqueo de tiempo (opcional)
    let user = global.db.data.users[m.sender];
    let time = user.lastcofre + 0;
    if (new Date - user.lastcofre < 0) {
      throw `[❗INFO❗] Ya reclamaste tu cofre.\nVuelve en *${msToTime(time - new Date())}* para reclamar de nuevo.`;
    }

    // Obtener eventos desde API
    let events = await fetchWeeklyEvents();

    let texto = `📕 *AGENDA SEMANAL DE FREE FIRE* 📕\n\n`;
    events.forEach(evt => {
      texto += `📅 *${evt.title}*\n🗓️ ${evt.start} → ${evt.end}\n${evt.description}\n\n`;
    });

    // Imagen genérica o la que devuelva la API
    let img = events[0]?.image || 'https://telegra.ph/file/daf0bc0fc3c1e4c471c5c.jpg';

    // Enviar mensaje
    await conn.sendFile(m.chat, img, 'agenda.jpg', texto, m);

    // Guardar última ejecución
    user.lastcofre = new Date * 1;

  } catch (err) {
    console.error(err);
    conn.reply(m.chat, '❌ Error al obtener la agenda semanal', m);
  }
};

handler.command = ['agendasemanal'];
handler.register = false;
export default handler;