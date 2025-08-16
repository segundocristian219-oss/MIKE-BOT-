import axios from 'axios';
import cheerio from 'cheerio';

let handler = async (m, { conn }) => {
  try {
    // Bloqueo de tiempo (opcional, según tu base de datos)
    let user = global.db.data.users[m.sender];
    let time = user.lastcofre + 0;
    if (new Date - user.lastcofre < 0) {
      throw `[❗INFO❗] Ya reclamaste tu cofre.\nVuelve en *${msToTime(time - new Date())}* para reclamar de nuevo.`;
    }

    // URL de la página que contiene la agenda semanal
    const url = 'https://as.com/meristation/noticias/agenda-semanal-de-free-fire-del-13-al-20-de-agosto-con-boveda-magica-y-ruleta-de-tokens-n/';
    
    // Petición HTTP y carga del HTML
    const res = await axios.get(url);
    const $ = cheerio.load(res.data);

    // Extraer la lista de eventos (selector CSS según la estructura de la web)
    const events = [];
    $('li').each((i, el) => { 
      const text = $(el).text().trim();
      if(text) events.push(text);
    });

    // Construir el texto del mensaje
    let texto = `📕 *AGENDA SEMANAL DE FREE FIRE* 📕\n\n`;
    events.forEach(item => { texto += `• ${item}\n`; });

    // Imagen genérica (puedes cambiarla)
    let img = 'https://telegra.ph/file/daf0bc0fc3c1e4c471c5c.jpg';

    // Enviar mensaje al chat
    await conn.sendFile(m.chat, img, 'agenda.jpg', texto, m);

    // Guardar la última vez que el usuario ejecutó el comando
    user.lastcofre = new Date * 1;

  } catch (err) {
    console.error(err);
    conn.reply(m.chat, '❌ Error al obtener la agenda semanal', m);
  }
};

// Función auxiliar para mostrar tiempo restante (si quieres mantener el bloqueo)
function msToTime(duration) {
  let hours = Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((duration % (1000 * 60)) / 1000);
  return `${hours}h ${minutes}m ${seconds}s`;
}

handler.command = ['agendasemanal'];
handler.register = false;
export default handler;