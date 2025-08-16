import axios from 'axios';
import cheerio from 'cheerio';

async function getWeeklyAgenda() {
  const url = 'https://as.com/meristation/noticias/agenda-semanal-de-free-fire-del-13-al-20-de-agosto-con-boveda-magica-y-ruleta-de-tokens-n/';
  const res = await axios.get(url);
  const $ = cheerio.load(res.data);

  const events = [];
  $('li').each((i, el) => { events.push($(el).text()); });
  
  return events;
}

async function buildAgendaText() {
  const agenda = await getWeeklyAgenda();
  let texto = `📅 *AGENDA SEMANAL DE FREE FIRE*:\n\n`;
  agenda.forEach(item => { texto += `• ${item}\n`; });
  return texto;
}