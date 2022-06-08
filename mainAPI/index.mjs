import {} from 'dotenv/config'
import express from 'express'; 
import bodyParser  from 'body-parser'  ;
import cors  from 'cors'; 
import path from 'path';
import {v4 as uuidv4} from 'uuid';
import { BotService } from "./model/BotService_LowDbImpl.mjs";
import { ChatBot } from './model/ChatBot.mjs';
import jwt from "jsonwebtoken";
//Question : How do I assigne a task to a person? : It is a PATCH to a Task...
const port = 3001

let botService;
let chatBotList = {};

const app = express();

//// Enable ALL CORS request
app.use(cors())
////

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use( function ( req, res, next ) {
    const { url, path: routePath }  = req ;
    console.log( 'Request: Timestamp:', new Date().toLocaleString(), ', URL (' + url + '), PATH (' + routePath + ').' ) ;
    next();
});

// A middle ware for serving static files
app.use('/', express.static(path.join(`${path.resolve()}/interfaceAdministrateur`, '')))

function validateToken(req, res, next) {
	//get token from request header
	try{
		console.log(req.headers["authorization"]);
		const authHeader = req.headers["authorization"];
		const token = authHeader.split(" ")[1];
		if (token == null){
			res.sendStatus(400).send("Token not present");
		}
		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
			if (err) { 
				 res.status(403).send("Token invalid");
			 }
			 else {
				 req.user = user;
				 next(); //proceed to the next action in the calling function
			 }
		}); //end of jwt.verify()
	}
	catch(err){
		res.sendStatus(400).send("Token not present");
	}
	//the request header contains the token "Bearer <token>", split the string and use the second value in the split array.
}

app.get('/bots', (req,res) => {
	try{
		let botsList = botService.getBots();
		res.status(200).json(botsList);
	}
	catch(err){
		console.log(`Error ${err} thrown... stack is : ${err.stack}`);
		res.status(404).send('NOT FOUND');
	}
})


app.get('/bots/:id', (req,res) => {
	let id = req.params.id;
	try{
		let botsList = botService.getBot(id);
		res.status(200).json(botsList);
	}
	catch(err){
		console.log(`Error ${err} thrown... stack is : ${err.stack}`);
		res.status(404).send('NOT FOUND');
	}
})

app.post('/bots',validateToken, (req, res) => {
	
	let id = uuidv4();

	botService.addBot({id:id, name:req.body.name, status:1})
	.then((message) => {
		res.status(201).send("Bot created");
	}).catch(err =>{
		console.log(`Error ${err} thrown... stack is : ${err.stack}`);
		res.status(404).send('BOT CREATION FAILED');
	});
});

app.delete('/bots/:id',validateToken, (req,res) => {
	console.log("ok")
	let id = req.params.id;
	console.log(id);
	try{
		botService.removeBot(id).then((text) => {
			res.status(200).send(text);
		});
	}
	catch(err){
		console.log(`Error ${err} thrown... stack is : ${err.stack}`);
		res.status(404).send('NOT FOUND');
	}
})


app.patch('/bots/:id',validateToken, (req, res) => {
	botService.updateBot(req.params.id, req.body)
	.then((message) => {
		res.status(200).send("Bot updated");
	}).catch(err =>{
		console.log(`Error ${err} thrown... stack is : ${err.stack}`);
		res.status(404).send('BOT CREATION FAILED');
	});
})

app.post('/chat/:id', (req, res) => {
	console.log("recu");
	if (chatBotList[req.params.id]) {
		chatBotList[req.params.id].mouth.myTalk(req.body.user, req.body.msg, (repl) => {
			console.log(repl);
			res.send(repl);
		})
	}
	else {
		res.send({
			code: -1,
			msg:"not find chatbot"
		})
	}
})

BotService.create().then(bs => {
	botService = bs;
	chatBotList = {};
	let bots = bs.getBots();
	for(let i=0; i<bots.length; i++){
		chatBotList[bots[i].id] = new ChatBot();
	}
	app.listen(port, () => {
		console.log(`Example app listening at http://localhost:${port}`)
	});
});