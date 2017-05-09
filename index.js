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

var football = false;
var question_team = false
var question_favplayers = false
var question_favmanager = false

var question_teamVal = ""
var question_favplayersVal = ""
var question_favmanagerVal = ""

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
			} else if(football) {
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
					question_favmanager = text
					football = false
					question_favmanager = false
					sendText(sender, "İlgi alanı: Futbol" + " Tutulan takım: " + question_teamVal +" Favori Oyuncular: " + question_favplayers + " En iyi teknik direktör: " + question_favmanager)
					football = false
					question_team = false
					question_favplayers = false
					question_favmanager = false

					question_teamVal = ""
					question_favplayersVal = ""
					question_favmanagerVal = ""
				}
			} 	
			sendText(sender, "Text echo: " + text.substring(0, 100))						
			


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