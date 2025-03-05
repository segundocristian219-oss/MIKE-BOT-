// Detecta si el mensaje contiene la palabra clave sin prefijo
const palabraClave = 'hola';  // Cambia esto por la palabra que desees
const textoRecibido = text.trim().toLowerCase();  // El texto recibido en el mensaje

// Si el mensaje contiene la palabra clave
if (textoRecibido === palabraClave.toLowerCase()) {
    conn.sendPresenceUpdate('recording', m.chat);  // Actualiza la presencia de grabación
    await conn.sendFile(m.chat, 'https://qu.ax/HPeS.mp3', `${palabraClave}.mp3`, null, m, true, { type: 'audioMessage' });
}
