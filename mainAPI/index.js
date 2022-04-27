import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import {BotService} from "./model/BotService_LowDbImpl.mjs";
let botServiceInstance;

import {PersonIdentifier,PersonService} from "./model/Persons.mjs";
let personServiceAccessPoint = new PersonService({url:"http://localhost",port:3002});
//Question : How do I assigne a task to a person? : It is a PATCH to a Task...


const app = express();


//// Enable ALL CORS request
app.use(cors())
////


const port = 3001

app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({ extended: true }))

// Return all the bots (GET method)
app.get('/', (req,res) => {

});



BotService.create(personServiceAccessPoint).then(bs=>{
	botServiceInstance=bs;
	app.listen(port, () => {
  		console.log(`Example app listening at http://localhost:${port}`)
	});
});