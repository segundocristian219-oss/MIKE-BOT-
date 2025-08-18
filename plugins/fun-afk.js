
const handler = async (m, {text}) => {
const user = global.db.data.users[m.sender];
user.afk = + new Date;
user.afkReason = text;
conn.fakeReply(m.chat, `『 ＡＦＫ 』

> ᴇʟ ᴜsᴜᴀʀɪᴏ ${conn.getName(m.sender)} ᴇsᴛᴀ ɪɴᴀᴄᴛɪᴠᴏ. 

*☣️ ᴍᴏᴛɪᴠᴏs :* ${text ? ': ' + text : 'paja'}`, '0@s.whatsapp.net', ``, 'status@broadcast', null, fake)
/*m.reply(`『 ＡＦＫ 』

> ᴇsᴛᴇ ᴜsᴜᴀʀɪᴏ : ${conn.getName(m.sender)} ᴇsᴛᴀ ɪɴᴀᴄᴛɪᴠᴏ. 
*☣️ ᴍᴏᴛɪᴠᴏs :* ${text ? ': ' + text : 'paja'}`);*/
};
handler.help = ['afk [alasan]'];
handler.tags = ['econ'];
handler.command = /^afk$/i;
handler.money = 95
export default handler;