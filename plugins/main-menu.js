import fetch from 'node-fetch';

const handler = async (m, {conn, usedPrefix, text, isPrems}) => {

  try {
    await m.react (emojis);
    const _uptime = process.uptime() * 1000;
    const uptime = clockString(_uptime);
    const videoUrl = 'https://files.catbox.moe/js58k4.mp4'
    const more = String.fromCharCode(8206);
    const readMore = more.repeat(850);
    const taguser = '@' + m.sender.split('@s.whatsapp.net')[0];
    let totalreg = Object.keys(global.db.data.users).length
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length

    const str = `ㅤㅤ   ꒰꛱ ͜ ꛱|꛱ ꛱͜ |꛱ ꛱͜ |꛱ ͜ ꛱|꛱ ͜ |୨🫧୧꛱|꛱ ꛱͜ |꛱ ꛱͜ |꛱ ͜ ꛱|꛱ ꛱͜ |꛱ ͜ ꒱
Ꮺ *H𐐫l⍺᳟ ࣪ ᦷᩘ${taguser}*
*Bienvenido/a*  ࣪  ⿻   al   ࣭  ෨
࣭   ✿  *menú  de  JotaBot*  𓈒𓏸      ☁︎    
﹏͜͡ *${saludo}* ﹏͜͡

> ꒰꛱ ͜Desarrollado por *Dev.Criss* +51927238856

*𓈒𓏸🌹 \`Bot Name:\`* ${botname}
*𓈒𓏸🍮 \`Activo:\`* ${uptime}
*𓈒𓏸🥞 \`Usuarios:\`* ${totalreg}
*𓈒𓏸🍟 \`Versión:\`* 1.0.0

> 🍭 Si encuentra un comando con errores no dudes en reportarlo con el Creador
${readMore}
ㅤㅤ *乂 ʟɪsᴛᴀ ᴅᴇ ᴄᴏᴍᴀɴᴅᴏs 乂*

╭──•「 *Menús* 」🤍
│🤍${usedPrefix}menunsfw
│🤍 ${usedPrefix}menuowner
│🤍 ${usedPrefix}menulogos
╰──•

╭──•「 *Info* 」☁️
│☁️ ${usedPrefix}totalf
│☁️ ${usedPrefix}grupos
│☁️ ${usedPrefix}sugerir
│☁️ ${usedPrefix}report
│☁️ ${usedPrefix}owner
│☁️ ${usedPrefix}ping
│☁️ ${usedPrefix}uptime
│☁️‎ ${usedPrefix}horario
│☁️‎ ${usedPrefix}precios
╰──•

╭──•「 *Config* 」⚙️
│⚙️ ${usedPrefix}enable *opción*
│⚙️ ${usedPrefix}disable *opción*
│⚙️ ${usedPrefix}on *opción*
│⚙️ ${usedPrefix}off *opción*
│⚙️ ${usedPrefix}manual
╰──•

╭──•「 *Download* 」🫧
│🫧 ${usedPrefix}play *texto*
│🫧 ${usedPrefix}ytmp4doc *texto*
│🫧 ${usedPrefix}ytmp3doc *texto*
│🫧 ${usedPrefix}apk *texto*
│🫧 ${usedPrefix}pinterest *texto*
│🫧 ${usedPrefix}pinvid *url*
│🫧 ${usedPrefix}ytv *url*
│🫧 ${usedPrefix}ytmp3 *url*
│🫧 ${usedPrefix}tiktok *url*
│🫧 ${usedPrefix}instagram *url*
│🫧 ${usedPrefix}facebook *url*
│🫧 ${usedPrefix}mediafire *url*
│🫧 ${usedPrefix}mega *url*
│🫧 ${usedPrefix}playstore *url*
│🫧 ${usedPrefix}xnxxdl *url*
│🫧 ${usedPrefix}xvideosdl *url*
╰──•

╭──•「 *Search* 」🍵
│🍵 ${usedPrefix}aplaysearch *texto*
│🍵 ${usedPrefix}ttsearch *texto*
│🍵 ${usedPrefix}ttsearch2 *texto*
│🍵 ${usedPrefix}ytsearch *texto*
│🍵 ${usedPrefix}spotifysearch *texto*
│🍵 ${usedPrefix}playstoresearch *texto*
│🍵 ${usedPrefix}xnxxsearch *texto*
│🍵 ${usedPrefix}xvsearch *texto*
│🍵 ${usedPrefix}gnula *texto*
│🍵 ${usedPrefix}mercadolibre *texto*
╰──•

╭──•「 *Menús* 」📜
│📜 ${usedPrefix}v4fem *hr + p*
│📜 ${usedPrefix}v4masc *hr + p*
│📜 ${usedPrefix}v4mixto *hr + p*
│📜 ${usedPrefix}v6fem *hr + p*
│📜 ${usedPrefix}v6masc *hr + p*
│📜 ${usedPrefix}v6mixto *hr + p*
╰──•

╭──•「 *Frases* 」💞
│💞 ${usedPrefix}piropo
│💞 ${usedPrefix}consejo
│💞 ${usedPrefix}fraseromantica
╰──•

╭──•「 *Converters* 」🌷
│🌷 ${usedPrefix}tourl *img*
│🌷 ${usedPrefix}tourl *aud*
│🌷 ${usedPrefix}toptt *aud*
│🌷 ${usedPrefix}toptt *vid*
│🌷 ${usedPrefix}tourl *vid*
│🌷 ${usedPrefix}tomp3 *vid*
│🌷 ${usedPrefix}toimg *sticker*
╰──•

╭──•「 *Tools* 」🛠️
│🛠️ ${usedPrefix}clima *texto*
│🛠️ ${usedPrefix}readmore *texto*
│🛠️ ${usedPrefix}read *texto*
│🛠️ ${usedPrefix}fake *texto + user + texto*
│🛠️ ${usedPrefix}traducir *idioma + texto*
│🛠️ ${usedPrefix}hd *img*
│🛠️ ${usedPrefix}whatmusic *aud*
│🛠️ ${usedPrefix}whatmusic *vid*
│🛠️ ${usedPrefix}flag *país*
│🛠️ ${usedPrefix}inspect *link*
│🛠️ ${usedPrefix}inspeccionar *link*
│🛠️ ${usedPrefix}nuevafotochannel
│🛠️ ${usedPrefix}nosilenciarcanal
│🛠️ ${usedPrefix}silenciarcanal
│🛠️ ${usedPrefix}seguircanal
│🛠️ ${usedPrefix}avisoschannel
│🛠️ ${usedPrefix}resiviravisos
│🛠️ ${usedPrefix}eliminarfotochannel
│🛠️ ${usedPrefix}reactioneschannel
│🛠️ ${usedPrefix}reaccioneschannel
│🛠️ ${usedPrefix}nuevonombrecanal
│🛠️ ${usedPrefix}nuevadescchannel
╰──•

╭──•「 *Groups* 」🌿
│🌿 ${usedPrefix}add *número*
│🌿 ${usedPrefix}grupo *abrir / cerrar*
│🌿 ${usedPrefix}grouptime *tiempo*
│🌿 ${usedPrefix}notify *texto*
│🌿 Aviso *texto*
│🌿 Admins *texto*
│🌿 ${usedPrefix}todos *texto*
│🌿 ${usedPrefix}setwelcome *texto*
│🌿 ${usedPrefix}groupdesc *texto*
│🌿 ${usedPrefix}setbye *texto*
│🌿 ${usedPrefix}promote *@tag*
│🌿 ${usedPrefix}demote *@tag*
│🌿 ${usedPrefix}kick *@tag*
│🌿 ${usedPrefix}mute *@tag*
│🌿 ${usedPrefix}inactivos *opción*
│🌿 ${usedPrefix}tagnum *prefix*
│🌿 ${usedPrefix}link
│🌿 ${usedPrefix}fantasmas
╰──•

╭──•「 *Efects* 」🥞
│🥞 ${usedPrefix}bass *vid*
│🥞 ${usedPrefix}blown *vid*
│🥞 ${usedPrefix}deep *vid*
│🥞 ${usedPrefix}earrape *vid*
│🥞 ${usedPrefix}fast *vid*
│🥞 ${usedPrefix}smooth *vid*
│🥞 ${usedPrefix}tupai *vid*
│🥞 ${usedPrefix}nightcore *vid*
│🥞 ${usedPrefix}reverse *vid*
│🥞 ${usedPrefix}robot *vid*
│🥞 ${usedPrefix}slow *vid*
│🥞 ${usedPrefix}squirrel *vid*
│🥞 ${usedPrefix}chipmunk *vid*
│🥞 ${usedPrefix}reverb *vid*
│🥞 ${usedPrefix}chorus *vid*
│🥞 ${usedPrefix}flanger *vid*
│🥞 ${usedPrefix}distortion *vid*
│🥞 ${usedPrefix}pitch *vid*
│🥞 ${usedPrefix}highpass *vid*
│🥞 ${usedPrefix}lowpass *vid*
│🥞 ${usedPrefix}underwater *vid*
╰──•

╭──•「 *Fun* 」🍁
│🍁 ${usedPrefix}gay *@tag*
│🍁 ${usedPrefix}lesbiana *@tag*
│🍁 ${usedPrefix}pajero *@tag*
│🍁 ${usedPrefix}pajera *@tag*
│🍁 ${usedPrefix}puto *@tag*
│🍁 ${usedPrefix}puta *@tag*
│🍁 ${usedPrefix}manco *@tag*
│🍁 ${usedPrefix}manca *@tag*
│🍁 ${usedPrefix}rata *@tag*
│🍁 ${usedPrefix}prostituto *@tag*
│🍁 ${usedPrefix}prostituta *@tag*
│🍁 ${usedPrefix}doxear *@tag*
│🍁 ${usedPrefix}jalamela *@tag*
│🍁 ${usedPrefix}simi *texto*
│🍁 ${usedPrefix}pregunta *texto*
│🍁 ${usedPrefix}genio *texto*
│🍁 ${usedPrefix}top
│🍁 ${usedPrefix}sorteo
│🍁 ${usedPrefix}piropo
│🍁 ${usedPrefix}chiste
│🍁 ${usedPrefix}facto
│🍁 ${usedPrefix}verdad
│🍁 ${usedPrefix}pareja
│🍁 ${usedPrefix}parejas
│🍁 ${usedPrefix}love
│🍁 ${usedPrefix}personalidad
╰──•

╭──•「 *Game* 」🕹️
│🕹️ ${usedPrefix}pregunta *texto*
│🕹️ ${usedPrefix}ttt *texto*
│🕹️ ${usedPrefix}ptt *opción*
│🕹️ ${usedPrefix}delttt
│🕹️ ${usedPrefix}acertijo
╰──•

╭──•「 *Anime* 」💫
│💫 ${usedPrefix}messi
│💫 ${usedPrefix}cr7
╰──•

╭──•「 *Nsfw* 」🔥
│🔥 ${usedPrefix}violar *@tag*
│🔥 ${usedPrefix}follar *@tag*
│🔥 ${usedPrefix}anal *@tag*
│🔥 ${usedPrefix}coger *@tag*
│🔥 ${usedPrefix}coger2 *@tag*
│🔥 ${usedPrefix}penetrar *@tag*
│🔥 ${usedPrefix}sexo *@tag*
│🔥 ${usedPrefix}rusa *@tag*
│🔥 ${usedPrefix}sixnine *@tag*
│🔥 ${usedPrefix}pies *@tag*
│🔥 ${usedPrefix}mamada *@tag*
│🔥 ${usedPrefix}lickpussy *@tag*
│🔥 ${usedPrefix}grabboobs *@tag*
│🔥 ${usedPrefix}suckboobs *@tag*
│🔥 ${usedPrefix}cum *@tag*
│🔥 ${usedPrefix}fap *@tag*
│🔥 ${usedPrefix}manosear *@tag*
│🔥 ${usedPrefix}lesbianas *@tag*
╰──•

╭──•「 *Stickers* 」🍮
│🍮 ${usedPrefix}sticker *img*
│🍮 ${usedPrefix}sticker *vid*
│🍮 ${usedPrefix}brat *texto*
│🍮 ${usedPrefix}qc *texto*
│🍮 ${usedPrefix}dado
╰──•

╭──•「 *Rpg* 」💸
│💸 ${usedPrefix}minar
│💸 ${usedPrefix}cofre
│💸 ${usedPrefix}slut
│💸 ${usedPrefix}nivel
│💸 ${usedPrefix}ruleta
╰──•

╭──•「 *Registro* 」🐼
│🐼 ${usedPrefix}perfil
│🐼 ${usedPrefix}reg
│🐼 ${usedPrefix}unreg
╰──•

╭──•「 *Owner* 」👑
│👑 ${usedPrefix}salir
│👑 ${usedPrefix}update
│👑 ${usedPrefix}blocklist
│👑 ${usedPrefix}grouplist
│👑 ${usedPrefix}restart
│👑 ${usedPrefix}join
│👑 ${usedPrefix}chetar
│👑 ${usedPrefix}unbanuser
╰──•`.trim();

      await conn.sendMessage(m.chat, {
            video: { url: videoUrl },
            caption: str,
            mentions: [m.sender],
            gifPlayback: true
        }, { quoted: fkontak })

  } catch (e) {
    conn.reply(m.chat,`*❌ Error al enviar el menú.*\n${e}`, m);
  }
};

handler.command = /^(menu|menú|memu|memú|help|info|comandos|2help|menu1.2|ayuda|commands|commandos|cmd)$/i;
handler.fail = null;

export default handler;

function clockString(ms) {
  const h = isNaN(ms) ? '--' : Math.floor(ms / 3600000);
  const m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
  const s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
  return [h, m, s].map((v) => v.toString().padStart(2, 0)).join(':');
}