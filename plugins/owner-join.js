let linkRegex = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i;

let handler = async (m, { conn, text }) => {
    if (!text) return m.reply(`⚡ Ingresa el enlace del Grupo.`);
    let match = text.match(linkRegex);
    if (!match) return m.reply('Enlace inválido.');
    let code = match[1];
    try {
        let res = await conn.groupAcceptInvite(code);
        m.reply(`🐾 Me uní correctamente al Grupo *${res}*`);
    } catch (e) {
        m.reply('❌ No pude unirme al grupo. El enlace puede ser inválido o expirado.');
    }
}

handler.help = ['join <link>'];
handler.tags = ['owner'];
handler.command = ['join', 'entrar'];
handler.owner = true;

export default handler;