import fetch from 'node-fetch'

export async function before(m, { conn }) {
//let img = await (await fetch(`https://n.uguu.se/kJAscemb.jpg`)).buffer()
let img = catalogo
 global.fake = {
    contextInfo: {
    	isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363402177795471@newsletter",
      serverMessageId: 100,
      newsletterName: '𝗔𝗻𝗴𝗲𝗹 𝗯𝗼𝘁 🎭',
    },
	    externalAdReply: {
				    showAdAttribution: true,
					title: botname,
					body: 'Hola',
					mediaUrl: null,
					description: null,
					previewType: "PHOTO",
					thumbnailUrl: 'https://n.uguu.se/kJAscemb.jpg',
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
newsletterJid: "120363402177795471@newsletter",
serverMessageId: 100,
newsletterName: '𝗔𝗻𝗴𝗲𝗹 𝗯𝗼𝘁 🎭',
},
externalAdReply: { 
showAdAttribution: true,
title: '𝗔𝗻𝗴𝗲𝗹 𝗯𝗼𝘁 🎭',
body: '𝗔𝗻𝗴𝗲𝗹 𝗯𝗼𝘁 🎭',
previewType: "PHOTO",
thumbnailUrl: 'https://n.uguu.se/kJAscemb.jpg',
sourceUrl: 'https://n.uguu.se/kJAscemb.jpg',
mediaType: 1,
renderLargerThumbnail: false
},},}
	
}
