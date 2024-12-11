const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
	    GatewayIntentBits.GuildMessages,
	    GatewayIntentBits.MessageContent,
	    GatewayIntentBits.GuildMembers
    ]});

const { ownerid, token} = require('./secret.json')
// const { REST, Routes} = require('discord.js');
// const rest = new REST({ version: '10' }).setToken(token);


const commands = [];

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);
})

client.on('interactionCreate', async interaction => {
    if (!interacion.isChatInputCommand()) return;
})

client.on('messageCreate', (message) => {
    if (message.author.bot) return;

    if (message.mentions.users.first() == client.user) message.reply("matate y grabalo");

    let messageText = message.content.trim(/\s+/);
    let messageTokens = message.content.split(/\s+/);


    console.log(message);
})

client.login(token);