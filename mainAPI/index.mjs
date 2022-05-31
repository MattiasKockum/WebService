import express from 'express'; 
import bodyParser  from 'body-parser'  ;
import cors  from 'cors'; 
import path from 'path'
import {v4 as uuidv4} from 'uuid'
import { BotService } from "./model/BotService_LowDbImpl.mjs";
import { ChatBot } from './model/ChatBot.mjs'
//Question : How do I assigne a task to a person? : It is a PATCH to a Task...
const port = 3001

const botService = await BotService.create()
console.log(botService)
var chatBotList = {}
//mod by xx :init chatBotList
let bots = botService.getBots()
for (let i = 0; i < bots.length;++i) {
	let chatBot = new ChatBot()
	chatBotList[bots[i].id]=chatBot
}

const app = express();

//// Enable ALL CORS request
app.use(cors())
////



app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use( function ( req, res, next ) {
    const { url, path: routePath }  = req ;
    console.log( 'Request: Timestamp:', new Date().toLocaleString(), ', URL (' + url + '), PATH (' + routePath + ').' ) ;
    next();
});


// A middle ware for serving static files
console.log (path.resolve())
app.use('/', express.static(path.join(`${path.resolve()}/interfaceAdministrateur`, '')))

app.get('/server/bots', (req,res) => {
	let bots = botService.getBots()
	let botsRes=[]
	for (let bot of bots) {
		botsRes.push({
			id: bot.id,
			name: bot.name,
			status:bot.status
		})
	}
	return res.send({
		code: 0,
		data: {
			bots:botsRes
		}
	})
})
app.get('/server/bot', (req,res) => {
	let bots = botService.getBots()
	let index = bots.findIndex(d => d.id = req.body.id)
	if (index > -1) {
		return res.send({
			code: 0,
			data: {
				id: bots[index].id,
				name: bots[index].name,
				status:bots[index].status
			}
		})
	}
	return res.send({
		code: -1,
		msg:'not find bot'
	})
})

app.post('/server/bot', (req, res) => {
	let id = uuidv4()
	botService.addBot({
		id: id,
		name: req.body.name,
		status: 1,
	}).then(dat => {
		let chatBot = new ChatBot()
		chatBotList[id] =chatBot
		res.send({
			code: 0,
			data: {
				id: id,
				name: req.body.name,
				status:1
			}
		})
	}).catch(e => {
	
		console.error(e)
		res.send({
			code: -1,
			msg:"create failed"
		})
	
	})
	
	

	
})

app.delete('/server/bot', (req,res) => {
	botService.removeBot(req.body.id).then(() => {
		if (chatBotList[req.body.id]) {
			delete chatBotList[req.body.id]
		}
		res.send({
			code: 0,
		})
	}).catch(e => {
		
		res.send({
			code: -1,
			msg:"delete failed"
		})
	})
})


app.patch('/server/bot', (req, res) => {
	botService.updateBot(req.body.id,req.body).then(() => {
		res.send({
			code: 0,
		})
	}).catch(e => {
		console.log(e)
		res.send({
			code: -1,
			msg:"update failed"
		})
	})
})

app.post('/server/chat', (req, res) => {
	if (chatBotList[req.body.botID]) {
		chatBotList[req.body.botID].mouth.myTalk(req.body.user, req.body.msg, (repl) => {
			res.send({
				code: 0,
				msg:repl
			})
		})
	}
	else {
		res.send({
			code: -1,
			msg:"not find chatbot"
		})
	}
})

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
});