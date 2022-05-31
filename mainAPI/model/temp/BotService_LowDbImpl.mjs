import {Bot} from "./Bot.mjs";
import {Low, JSONFile} from 'lowdb';


class BotService{

	constructor(){ 
		this.db = {};
	}

	static async create(){ //since I cannot return a promise in a constructor
		const service = new TaskService();
		const adapter = new JSONFile("./model/db.json");
		service.db = new Low(adapter);
		await service.db.read();
		service.db.data = service.db.data || { bots: [] } //if db is null, create it.
		return service;
	}


	async addBot(anObject){
		let newBot;
		try{
  			newBot = new Bot(anObject);
		}catch(err){
			throw err; //throwing an error inside a Promise
		}
		this.db.data.bots.push(newBot);
		await this.db.write();
		return `added task of id ${newBot.id}`;
	}


	//from PUT
	async replaceTask(id, anObject){
		let index = this.db.data.tasks.findIndex(e=> e.id == id);	
		if(index >-1 ){
			//At this point, you may have a safeguard to verify if the given Object is a Task
			if(Task.isTask(anObject)){
				/// Just replace it already!
				this.db.data.tasks.splice(index,1,anObject);
				await this.db.write();
				return "Done REPLACING";
			}
			throw new Error(`given object is not a Task : ${anObject}`);
		}
		throw new Error(`cannot find task of id ${id}`);
	}

	//from PATCH
	async updateTask(id, anObject){
		let index = this.db.data.tasks.findIndex(e=> e.id == id);	
		if(index >-1 ){
			//At this point, you may have a safeguard to verify if the fields of the given Object are from a Task
			for(let property in anObject){
				if(!Task.isValidProperty(property,anObject[property])){
					throw new Error(`given property is not a valid Task property : ${anObject}`);	
				}
			}
			//At this point, we are sure that all properties are valid and that we can make the update.
			for(let property in anObject){
				(this.db.data.tasks)[index][property] = anObject[property];
			}
			await this.db.write();
			return "Done UPDATING";
		}
		throw new Error(`cannot find task of id ${id}`);
	}


	async removeTask(id){
		let index = this.db.data.tasks.findIndex(e=> e.id == id);
		if(index >-1 ){
			this.db.data.tasks.splice(index,1);
			await this.db.write();
			return `removed task of id ${id}`;
		}
		throw new Error(`cannot find task of id ${id}`);
	}

	getTask(id){
		let index = this.db.data.tasks.findIndex(e=> e.id == id);
		if(index >-1 ){
			return  (this.db.data.tasks)[index];
		}
		throw new Error(`cannot find task of id ${id}`);	
	}

	getBots(){
		return this.db.data.bots;
	}

	



}

export {BotService}