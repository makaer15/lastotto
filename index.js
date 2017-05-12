'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const app = express()

app.set('port', (process.env.PORT || 5000))

// Allows us to process the data

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// Routes

app.get('/', function(req, res) {
	res.send("hi i am a chatbot")
})

let token = "EAAEHPrZCazEgBAOLQueoPTNdYgl3FR3He2VxpMil3b1lVm6q6mRtwpZCWToDXhQ2jGCJsxoZBAYZBixSHz8lDx0HUzhZCdzFQXRjdGKKjW8rxrYYkQiHsqZAQzCdKElPwAKXEfELWRmbosFbu8e0YV4cTjBu7uHIQFVHwitKU4FwZDZD"

// Facebook

app.get('/webhook/', function(req, res) {
	if(req.query['hub.verify_token'] === "xd") {
		res.send(req.query['hub.challenge'])
	}
	res.send("Wrong token")
})

var ilgi = false;
var football = false;
var question_team = false
var question_favplayers = false
var question_favmanager = false

var ilgiVal = ""
var question_teamVal = ""
var question_favplayersVal = ""
var question_favmanagerVal = ""

var books = false;
var question_booktype = false
var question_localorforeign = false
var question_favAuthor = false
var question_lastBookRead = false

var question_booktypeVal = ""
var question_localorforeignVal = ""
var question_favAuthorVal = ""
var question_lastBookReadVal = ""

app.post('/webhook/', function(req, res) {
	let messaging_events = req.body.entry[0].messaging
	for(let i = 0; i < messaging_events.length; i++) {
		let event = messaging_events[i];
		let sender = event.sender.id
		if(event.message && event.message.text) {
			let text = event.message.text
			if(text.includes("futbol")) {
				football = true
				sendText(sender, "Hangi takımı tutuyorsunuz?")
				question_team = true
			} else if(text.includes("kitap")) {
				books = true
				sendText(sender, "Hangi tür kitaplardan hoşlanırsın?")
				question_booktype = true
			} else if(text.includes("ilgi")) {
				sendText(sender, "İlgi alanınız veya yapmaktan hoşlandığınız şey nedir?");
				ilgi = true
			}
			else if(books) { // ******************************************************************************************
				if(question_booktype) {
					question_booktypeVal = text
					question_booktype = false
					question_localorforeign = true
					sendText(sender, question_booktypeVal + " kitaplarından yerli mi yabancı mı daha çok seversin?")
				} else if(question_localorforeign) {
					question_localorforeignVal = text
					question_localorforeign = false
					question_favAuthor = true
					sendText(sender, "Sevdiğin yazarlardan 2 tane söyler misin?")
				} else if(question_favAuthor) {
					question_favAuthor = false
					question_favAuthorVal = text
					question_lastBookRead = true
					sendText(sender, "En son okuduğun kitabı söyler misin?")
				} else if(question_lastBookRead) {
					question_lastBookRead = false
					question_lastBookReadVal = text
					books = false
					sendText(sender, "İlgi alanı: Kitaplar.\nTür: " + question_booktypeVal + "\nYerli/Yabancı: " + question_localorforeignVal +  "\nYazarlar: " + question_favAuthorVal + "\nEn son okunan kitap: " + question_lastBookReadVal)
				}
			} else if(football) { // ******************************************************************************************
				if(question_team) {
					question_teamVal = text
					sendText(sender, "En sevdiğiniz 2 oyuncuyu söyler misiniz?")
					question_team = false
					question_favplayers = true
				} else if(question_favplayers) {
					question_favplayersVal = text
					sendText(sender, "Sizce gelmiş geçmiş en iyi teknik direktör kim?")
					question_favplayers = false
					question_favmanager = true
				} else if(question_favmanager) {
					question_favmanagerVal = text
					football = false
					question_favmanager = false
					sendText(sender, "İlgi alanı: Futbol\n" + " Tutulan takım: " + question_teamVal +"\nFavori Oyuncular: " + question_favplayersVal + "\nEn iyi teknik direktör: " + question_favmanagerVal)
					
					football = false
					question_team = false
					question_favplayers = false
					question_favmanager = false

					question_teamVal = ""
					question_favplayersVal = ""
					question_favmanagerVal = ""
				}
			} else if(ilgi) {
				ilgiVal = text
				ilgi = false
				sendText(sender, "İlgi alanı: " + ilgiVal)
			}else {
				sendText(sender, "İlgi alanlarından birisine ihtiyacım var. Şunlardan birisini seçebilirsin: futbol, kitap. Kendi ilgi alanını söylemek için ilgi yaz.")	
			}
		}
	}
	res.sendStatus(200)
})




function sendText(sender, text) {
	let messageData = {text: text}
	request({
		url: "https://graph.facebook.com/v2.6/me/messages", 
		qs: {access_token: token},
		method: "POST",
		json: {
			recipient: {id: sender},
			message: messageData
		}
	}, function(error, response, body) {
		if(error) {
			console.log("sending error")
		} else if(response.body.error) {
			console.log("response body error")
		}
	})
}






app.listen(app.get('port'), function() {
	console.log("running: port")
})