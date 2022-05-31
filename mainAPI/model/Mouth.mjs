import { Client, Intents } from  "discord.js"
import { discordToken } from '../../config.js'

class Mouth{

    static discord;
    static talk;/**mod by xx */
    static ws;
    static bot;
    /**
     * mod by xx 
     * */
    constructor(talk){
    
        
        this.talk = talk
        
        //discord part  mod by xx
        this.bot = new Client({
            partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
            intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
        })
        this.bot.on('ready', function () { console.log("robot connect !") })
     
        this.bot.on('messageCreate', message => {
           
            if(message.author.id != this.bot.application.id)
            {
                if (this.talk) {
                    this.talk(message.author.name, message.content, (msg) => {
                        message.reply(msg)
                    })
                }
            }
        })

        this.bot.login(discordToken)
    }
    //mod by xx
    myTalk(authName,msg,responseChannel) {
        if (this.talk) {
            this.talk(authName, msg, (msg) => {
                responseChannel(msg)
            })
        }
    }

}

export {Mouth};