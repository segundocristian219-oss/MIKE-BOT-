import fetch from 'node-fetch'

export async function before(m, { conn }) {
//let img = await (await fetch(`https://files.catbox.moe/5k7vwl.jpg`)).buffer()
let img = catalogo
 global.fake = {
    contextInfo: {
    	isForwarded: true,
    forwardedNewsletterMessageInfo: {
            newsletterJid: "120363401389725319@newsletter",
      serverMessageId: 100,
          newsletterName: '𝐁𝐔𝐔 𝐁𝐎𝐓 🔮',
    },
	    externalAdReply: {
				    showAdAttribution: true,
					title: botname,
					body: 'Hola',
					mediaUrl: null,
					description: null,
					previewType: "PHOTO",
					thumbnailUrl: 'https://files.catbox.moe/5k7vwl.jpg',
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
newsletterJid: "120363401389725319@newsletter",
serverMessageId: 100,
newsletterName: '𝐁𝐔𝐔 𝐁𝐎𝐓 🔮',
},
externalAdReply: { 
showAdAttribution: true,
title: '𝐁𝐔𝐔 𝐁𝐎𝐓 🔮',
body: '𝐁𝐔𝐔 𝐁𝐎𝐓 🔮',
previewType: "PHOTO",
thumbnailUrl: 'https://files.catbox.moe/5k7vwl.jpg',
sourceUrl: 'https://files.catbox.moe/5k7vwl.jpg',
mediaType: 1,
renderLargerThumbnail: false
},},}
	
}
