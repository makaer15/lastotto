var football = false;
var question_team = false
var question_favplayers = false
var question_favmanager = false

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
			} else if(books) { // ******************************************************************************************
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
			} else {
				sendText(sender, "İlgi alanlarından birisine ihtiyacım var. Şunlardan birisini seçebilirsin: Futbol, Kitaplar.")	
			}	
									
			


		}
	}
	res.sendStatus(200)
})