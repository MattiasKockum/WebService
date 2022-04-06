import express from "express"
import { token } from './config.js'
console.log(token)

// Define "require"
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const { Client, Intents } = require("discord.js")
const bot = new Client({ intents: [Intents.FLAGS.DIRECT_MESSAGES] })

bot.on('ready', function () {
  console.log("Je suis connecté !")
})

bot.login(token)
