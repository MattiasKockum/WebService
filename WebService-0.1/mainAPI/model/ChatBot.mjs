/**
 * mod by xx
 */
import { Brain } from './Brain.mjs'
import { Mouth } from './Mouth.mjs'
import { Bot } from './Bot.mjs'

class ChatBot {
	static brain
	static mouth
	static bot
	constructor() {
		//init brain
		this.brain = new Brain({
			admin: "admin",
			begin: "begin",
			clients: "clients",
			coffee: "coffee",
			eliza: "eliza",
			hello: "hello",
			javascript: "javascript",
			myself: "myself",
			rpg:"rpg"
		})
		this.brain.initBrain()
		//init mouth
		this.mouth = new Mouth(
			//talk function
			(authName,message,responseChannel) =>{
				this.brain.think(authName, message).then(msg => {
					responseChannel(msg)
				}).catch(err => {
					responseChannel('I can not think')
				})
			})
	}
}

export {ChatBot}