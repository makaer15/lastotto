'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const mysql = require('mysql')

const app = express()


app.set('port', (process.env.PORT || 5000))

// Allows us to process the data

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// SQL

var db_config = {
	host:'us-cdbr-iron-east-03.cleardb.net',
	user:'b5205c69d0fec4',
	password:'68f67dfb',
	database: 'heroku_566804f49eae7b0'
};

var connection;

function handleDisconnect() {
    console.log('1. connecting to db:');
    connection = mysql.createConnection(db_config); 
													

    connection.connect(function(err) {              	
        if (err) {                                     
            console.log('2. error when connecting to db:', err);
            setTimeout(handleDisconnect, 1000); 
        }                                     
    });                                     	
    connection.on('error', function(err) {
        console.log('3. db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { 	
            handleDisconnect();                      	
        } else {                                      
            throw err;                                  
        }
    });
}
handleDisconnect();

app.get('/showinterests', function(req,res){
	connection.query('select * from interest', function(err,rows, fields){
		if (err){
			
			console.log('error', err);
			throw err;
		}else
			res.send(["",rows]);
	});
});

// app.get('/isUserExists', function (req, res){
//   // userid will be got from the conversation.
//    connection.isUserExists('select count(*) as count from user where userid = ' + userid, function (err,rows,fields){
//     if (err){
//       console.log('error: ',err);
//       throw err;
//     }
//     res.send(["", rows]);
// })


app.get('/isInterestExists', function (req, res){ 
  // interestname will be got from the conversation.
  connection.x('select count(*) as count from interest where name = "müzik"', function (err,rows,fields){
    if (err){
      console.log('error: ',err);
      throw err;
    }
    res.send(["", rows]);
  });
})


// app.get('/isInterestExistsForUser', function (req, res){ 
//   // userid will be got from the conversation.
//   // interestid will be got from the method queryInterestid.
//   connection.isInterestExistsForUser('select *, count(*) as count from interest_user inner join user on interest_user.userid2 = user.userid where interest_user.userid2 = ' +
//   userid + ' and interest_user.interestid2 = ' + interestid, function (err,rows,fields){
//     if (err){
//       console.log('error: ',err);
//       throw err;
//     }
//     res.send(["", rows]);
//   });
// })



// app.get('/insertUser', function (req, res){ 
//   // userid will be got from the conversation. Before using this, check the user exists in the db first using the implemented method.
//   connection.insertUser('insert into user values(' + userid + ')', function (err,rows,fields){
//     if (err){
//       console.log('error: ',err);
//       throw err;
//     }
//     res.send(["", rows]);
//   });
// })


// app.get('/insertInterest', function (req, res){ 
//   // interestname will be got from the conversation.
//   connection.insertInterest('insert into interest values(' + interestname + ')', function (err,rows,fields){
//     if (err){
//       console.log('error: ',err);
//       throw err;
//     }
//     res.send(["", rows]);
//   });
// })

// app.get('/insertInterestForUser', function (req, res){ 
//   // userid will be got from the conversation.
//   // interestid will be got from queryInterestid method if it exists. If it does not, it will be created and queried again to get its id.
//   connection.insertInterestForUser('insert into interest_user values(' + userid + ', ' + interestid  + ')', function (err,rows,fields){
//     if (err){
//       console.log('error: ',err);
//       throw err;
//     }
//     res.send(["", rows]);

//   });
// })


// app.get('/queryInterestid', function (req, res){ 
//   // interestname will be got from the conversation.
//   connection.queryInterestid('select interestid from interest where name = ' + interestname, function (err,rows,fields){
//     if (err){
//       console.log('error: ',err);
//       throw err;
//     }
//     res.send(["", rows]);
//   });
// })

// app.get('/queryUsers', function (req, res){ 
//   // interest will be got from the conversation and then its id will be found using methods when user asks for a recommendation.
//   connection.queryUsers('select userid from interest_user where interestid2 = ' + interestid, function (err,rows,fields){
//     if (err){
//       console.log('error: ',err);
//       throw err;
//     }
//     res.send(["", rows]);
//   });

// })





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

var car=false;
var question_carType=false;
var question_carBrand=false;
var question_favCarModel=false;

var question_carTypeValue="";
var question_carBrandValue="";
var question_favCarModelValue="";

var movie=false;
var question_movieType=false;
var question_movieName=false;

var question_movieTypeValue="";
var question_movieNameValue="";

var game=false;
var question_gameType=false;
var question_ganePlatform=false;
var question_gameName=false;

var question_gameTypeValue="";
var question_gamePlatformValue="";
var question_gameNameValue="";

var music = false;
var question_musicType=false;
var question_favSinger=false;
var question_favSing=false;

var question_musicTypeValue = "";
var question_faveSingerValue= "";
var question_faceSingValue="";

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
			} else if(text.includes("müzik")) {
				music = true
				sendText(sender, "Hangi tür müziklerden hoşlanırsın")
				question_musicType = true	
			} else if(text.includes("araba")) {
				car = true
				sendText(sender, "Hangi tür arabalardan hoşlanırsın")
				question_carType = true	
			} else if (text.includes("film")) {
				movie=true
				sendText(sender, "Hangi tür filmlerden hoşlanırsın")
				question_movieType = true	
            } else if (text.includes("oyun")) {
				game=true
				sendText(sender, "Hangi tür oyunlardan hoşlanırsın")
				question_gameType = true	
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
					sendText(sender, "İlgi alanı: Futbol\n" + "Tutulan takım: " + question_teamVal +"\nFavori Oyuncular: " + question_favplayersVal + "\nEn iyi teknik direktör: " + question_favmanagerVal)
					
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
			} 


			else if (music) {
				if(question_musicType) {
					question_musicTypeValue = text
					question_musicType = false
					question_localorforeign = true
					sendText(sender, question_musicTypeValue + " müziklerden yerli mi yabancı mı daha çok seversin?")
			}

			 else if(question_localorforeign) {
					question_localorforeignVal = text
					question_localorforeign = false
					question_favSinger = true
					sendText(sender, "Sevdiğin 2 tane şarkıcı söyler misin?")
			} else if(question_favSinger) {
					question_favSinger = false
					question_faveSingerValue = text
					question_favSing = true
					sendText(sender, "En sevdiğiniz şarkının adı nedir?")
			}
			  else if(question_favSing) {
					question_favSing = false
					question_faceSingValue = text
					music = false
					sendText(sender, "İlgi alanı: Müzik.\nTür: " + question_musicTypeValue + "\nYerli/Yabancı: " + question_localorforeignVal +  "\nŞarkıcı: " + question_faveSingerValue + "\nEn sevdiğiniz şarkı: " + question_faceSingValue)
					question_faceSingValue = ""
					question_faveSingerValue = ""
					question_localorforeignVal = ""
					
				}

			}	


			else if (car) {
				if(question_carType) {
					question_carTypeValue = text
					question_carType = false
					question_carBrand = true
					sendText(sender, "Hangi marka arabalardan hoşlanırsın?")
			    }

			    else if(question_carBrand) {
					question_carBrandValue = text
					question_carBrand = false
					question_favCarModel = true
					sendText(sender, "En sevdiğin araba modeli nedir?")
			    } 
			    else if(question_favCarModel) {
					question_favCarModel = false
					question_favCarModelValue = text
					car = false
					sendText(sender, "İlgi alanı: Araba.\nTür: " + question_carTypeValue +  "\nMarka: " + question_carBrandValue + "\nEn sevdiğiniz model: " + question_favCarModelValue)

			    }
			 
            }

            
            else if (movie) {
				if(question_movieType) {
					question_movieTypeValue = text
					question_movieType = false
					question_movieName = true
					sendText(sender, " Favori filmin nedir?")
			    }

			    else if(question_movieName) {
					question_movieName = false
					question_movieNameValue = text
					movie = false
					sendText(sender, "İlgi alanı: film.\nTür: " + question_movieTypeValue +  "\nFavori film: " + question_movieNameValue)

			    }
			 
            }

            else if (game) {
				if(question_gameType) {
					question_gameTypeValue = text
					question_gameType = false
					question_ganePlatform = true
					sendText(sender, "Hangi platformda oyun oynamayı seversin?")
			    }

			    else if(question_ganePlatform) {
					question_gamePlatformValue = text
					question_ganePlatform = false
					question_gameName = true
					sendText(sender, "En sevdiğin oyun nedir?")
			    } 
			    else if(question_gameName) {
					question_gameName = false
					question_gameNameValue = text
					game = false
					sendText(sender, "İlgi alanı: Oyun.\nTür: " + question_gameTypeValue +  "\nPlatform: " + question_gamePlatformValue + "\nEn sevdiğiniz oyun: " + question_gameNameValue)

			    }
			 
            } else {
				sendText(sender, "Merhaba, İlgi alanlarından birisine ihtiyacım var. Şunlardan birisini seçebilirsin: futbol, kitap, müzik, araba, film, oyun. Kendi ilgi alanını söylemek için lütfen ilgi yaz.")	
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
