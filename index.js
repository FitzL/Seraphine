const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
	    GatewayIntentBits.GuildMessages,
	    GatewayIntentBits.MessageContent,
	    GatewayIntentBits.GuildMembers
    ]});

let failedMessages = 0;
let silencio = false;

const { ownerid, token } = require('./secret.json');

const respuestas = [
    "matate y grabalo",
    "me voy a matar al frente de tu casa",
    "puto",
    "1 mensaje bloqueado",
    "suicidate",
    "Muerete",
    "Los odio",
    "Te voy a matar hijo de perra"
]

const carino = [
    "Como estás bebe?",
    "gracias wapa",
    "neko hug",
    "no",
    "si"
]

const mensajes = [
    "Ola",
    "Sale lol? ",
    "Estoy aburrida",
    "Argentina es el mejor país de Argentina"
    // "<@808322505264988220> Tengo una idea con swain",
    // "<@808322505264988220> Tengo una idea con Rell"
]
// const { REST, Routes} = require('discord.js');
// const rest = new REST({ version: '10' }).setToken(token);

let commands = [];

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);
})

client.on('interactionCreate', async interaction => {
    if (!interacion.isChatInputCommand()) return;
})

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    let messageText = message.content.trim(/\s+/);
    let messageTokens = message.content.split(/\s+/);

    if (messageTokens[0] == "silencio" && messageTokens[1] == "bot" && messageText.includes("silencio gil")) { message.reply("me callo"); silencio = true};
    if (messageTokens[0] == "habla" && messageTokens[1] == "bot") { message.reply("hablo de nuevo"); silencio = false};

    if (silencio) return;
    if (Math.random() < 0.02 + (failedMessages / 60)) mensaje(mensajes, message);
    else failedMessages++;

    if (message.author.id == "702283061298987089" && message.mentions.users.first() == client.user) return responder (carino, message);
    if (message.mentions.users.first() == client.user) await responder(respuestas, message);


    console.log(messageText);
})

client.login(token);

async function responder(lista, message, delayMin = 20, delayMax = 600)  {
    let opcion = lista[~~(Math.random() * lista.length)];
	let delay = ~~(Math.random() * (delayMax - delayMin + 1) + delayMin) * 1000;

    console.log(delay/1000, " segundos para responder.")

    setTimeout( () => {
        message.reply(opcion);
        return
    }, delay)
}

async function mensaje(lista, message, delayMin = 20, delayMax = 600)  {
    let opcion = lista[~~(Math.random() * lista.length)];
    let delay = ~~(Math.random() * (delayMax - delayMin + 1) + delayMin) * 1000;

    failedMessages = 0;

    console.log(delay/1000, "segundos para webear.")

    setTimeout( () => {
        message.channel.send(opcion);
        return
    }, delay)
}
