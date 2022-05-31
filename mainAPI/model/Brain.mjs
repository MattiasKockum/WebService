
import RiveScript from "rivescript"

class Brain{

    static admin;
    static begin;
    static clients;
    static coffee;
    static eliza;
    static hello;
    static javascript;
    static myself;
    static rpg;
    static riveBot;
    constructor(data){

        this.admin = data.admin;
        this.begin = data.begin;
        this.clients = data.clients;
        this.coffee = data.coffee;
        this.eliza = data.eliza;
        this.hello = data.hello;
        this.javascript = data.javascript;
        this.myself = data.myself;
        this.rpg = data.rpg;
        
    }

    /**
     * mod by xx
     */
    async initBrain() { 
        try {
            
            this.riveBot = new RiveScript();
            await this.riveBot.loadDirectory("./brain")
            console.log("Bot has finished loading!");
            // Now the replies must be sorted!
            this.riveBot.sortReplies();

        }
        catch (e) {
            this.riveBot = null
            throw ('Error init brain ' + e)
            
        }
    }
     /**
     * mod by xx
     */
    async think(userName, msg) {
        if (!this.riveBot) {
            throw("brain not init")
        }
        let rep = await this.riveBot.reply(userName, msg)
        if(rep!= "ERR: No Reply Matched"){
            return rep
        }
        else {
            return "I do not understand"
        }
  
    }
}

export {Brain};