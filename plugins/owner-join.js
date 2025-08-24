let handler = async (m, { conn, text }) => {
    if (!text) return m.reply(`⚡ Ingresa el enlace del Grupo.`);

    // Extraer automáticamente cualquier enlace de WhatsApp en el texto
    let linkRegex = /https?:\/\/chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/gi;
    let match = linkRegex.exec(text);
    if (!match) return m.reply('Enlace inválido. Asegúrate de copiarlo completo desde WhatsApp.');

    let code = match[1];

    try {
        let res = await conn.groupAcceptInvite(code);
        m.reply(`🐾 Me uní correctamente al Grupo *${res}*`);
    } catch (e) {
        console.error('Error al unirse:', e);

        let msg = '❌ No pude unirme al grupo.';

        // Mensajes de error claros
        if (e?.status === 401 || /invitation code invalid/i.test(e.message)) {
            msg += ' El enlace es inválido o expirado.';
        } else if (/too many participants/i.test(e.message)) {
            msg += ' El grupo está lleno.';
        } else if (/not authorized/i.test(e.message)) {
            msg += ' Mi número no puede unirse a este grupo.';
        } else if (/already joined/i.test(e.message)) {
            msg += ' Ya estoy en este grupo.';
        } else if (/requires approval/i.test(e.message) || /approval/i.test(e.message)) {
            msg += ' Este grupo requiere aprobación del administrador. No puedo unirme automáticamente.';
        } else {
            msg += ` Error: ${e.message || e}`;
        }

        m.reply(msg);
    }
};

handler.help = ['join <link>'];
handler.tags = ['owner'];
handler.command = ['join', 'entrar'];
handler.owner = true;

export default handler;