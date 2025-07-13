import fetch from 'node-fetch'

export async function before(m, { conn }) {
//let img = await (await fetch(`https://files.catbox.moe/iydxk1.jpg`)).buffer()
let img = catalogo
 global.fake = {
    contextInfo: {
    	isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363422161687949@newsletter",
      serverMessageId: 100,
      newsletterName: '𝗦𝗵𝗮𝗱𝗼𝘄 𝗕𝗼𝘁 🍷',
    },
	    externalAdReply: {
				    showAdAttribution: true,
					title: botname,
					body: 'Hola',
					mediaUrl: null,
					description: null,
					previewType: "PHOTO",
					thumbnailUrl: 'https://files.catbox.moe/iydxk1.jpg',
		           sourceUrl: canal,
		           mediaType: 1,
                   renderLargerThumbnail: false
	    },
    },
  }

 global.adReply = {
	    contextInfo: { 
             forwardingScore: 9999, 
                 isForwarded: false, 
                    externalAdReply: {
				    showAdAttribution: true,
					title: botname,
					body: textbot,
					mediaUrl: null,
					description: null,
					previewType: "PHOTO",
					thumbnailUrl: img,
                    thumbnail: img,
		           sourceUrl: canal,
		           mediaType: 1,
                   renderLargerThumbnail: true
				}
			}
		}

global.rcanal = {
contextInfo: {
isForwarded: true,
forwardedNewsletterMessageInfo: {
newsletterJid: "120363422161687949@newsletter",
serverMessageId: 100,
newsletterName: '𝗦𝗵𝗮𝗱𝗼𝘄 𝗕𝗼𝘁 🍷',
},
externalAdReply: { 
showAdAttribution: true,
title: '𝗦𝗵𝗮𝗱𝗼𝘄 - 𝗕𝗼𝘁 🍷',
body: '𝗖𝗿𝗶𝘀𝘁𝗶𝗮𝗻 𝗱𝗼 𝗺𝗲𝗷𝗼𝗿 🍷',
previewType: "PHOTO",
thumbnailUrl: 'https://files.catbox.moe/iydxk1.jpg',
sourceUrl: 'https://www.instagram.com/baki_hm66?igsh=cHk1eW1uZXF2ZWsy',
mediaType: 1,
renderLargerThumbnail: false
},},}
	
}
