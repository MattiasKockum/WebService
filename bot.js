// Imports

import express from "express"

// Define "require"
import { createRequire } from "module";
const require = createRequire(import.meta.url);

import RiveScript from "rivescript"


// riveBot part

var riveBot = new RiveScript();

riveBot.loadDirectory("brain").then(loading_done).catch(loading_error)

function loading_done() {
  console.log("Bot has finished loading!");

  // Now the replies must be sorted!
  riveBot.sortReplies();

  // And now we're free to get a reply from the brain!

	/*
  // RiveScript remembers user data by their username and can tell
  // multiple users apart.
  let username = "local-user";
  */
}

// It's good to catch errors too!
function loading_error(error, filename, lineno) {
  console.log("Error when loading files: " + error);
}


// Discord bot part

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
