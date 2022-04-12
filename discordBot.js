// Discord modules and token
const { Client, Intents } = require("discord.js")
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })
import { discordToken } from './config.js'

bot.on('ready', function () {console.log("Je suis connecté !")})

bot.on('message', message => {
        if(message.channel.name == "bot-channel" && message.author.id != bot.application.id)
        {
            let entry = message.content // recieved message
            // var output = "" // message to answer

            riveBot.reply(message.author.name, entry).then(function(reply)
                {
                    var output = reply;
                    // sending the message
                    if(output != "ERR: No Reply Matched")
                    {
                        message.channel.send(output)
                    }
                    else
                    {
                        message.channel.send("I do not understand")
                    }
                }
            );
        }
    }   
)

bot.login(discordToken)
