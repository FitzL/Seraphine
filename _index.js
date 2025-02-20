const fs = require('fs');
const path = require('path');
const dir = 'comandos';

const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

const { ownerid, token } = require('./secret.json');
let comandos = [];
let tiempoDesdeUltimoComando = Date.now();

let ultimoPersonaje = 0;
let rechazos = [
    "Matate",
    "No quiero",
    "Maricon",
    "Luego"
];

let sistema = {
    ultimoPersonaje: ultimoPersonaje
}

// const { REST, Routes} = require('discord.js');
// const rest = new REST({ version: '10' }).setToken(token);

let commands = [];

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);

    const archivosComandos = fs.readdirSync(path.join(__dirname, dir)); //capturamos todos los archivos de la carpeta

    for (let archivoComando in archivosComandos) {
        let nombreComando = archivosComandos[archivoComando];  // un archivo x de la lista
        const comando = require(path.join(__dirname, dir, nombreComando)); //require el archivo
        // let { testing } = c;
        comandos.push(comando); //añadir a la lista de comandos

        console.log(
            "Cargado: "
            + `["${comando.alias.join("\", \"")}"] `);
    }
})

client.on('interactionCreate', async interaction => {
    if (!interacion.isChatInputCommand()) return;
})

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    let messageTokens = message.content.split(/\s+/);

    console.log(messageTokens.length);

    if (messageTokens.shift().toLowerCase() != "sera") return;
    const command = messageTokens.shift().toLowerCase();

    for (const commandOptions of comandos) {
        let {
            alias,
            descripcion,
            testing,
            callback
        } = commandOptions;

        for (const _alias of alias) {
            if (command.toLowerCase() != _alias) continue;

            if (Math.random() < 0.075) {
                return message.reply(rechazos[~~(rechazos.length * Math.random())])
            };

            if (testing && (message.author.id != ownerid)) {
                message.reply("Este comando está en progreso. Disculpas...");
                return;
            }

            if (((message.createdTimestamp - tiempoDesdeUltimoComando)) < 2_000) {
                return message.reply("Dame un segundo.").then(m => { setTimeout(() => { m.delete() }, 2_000) });
            }

            try {
                await callback(messageTokens, message, client, sistema).catch(e => console.log(e));
            } catch (err) {
                console.log(err);
            }
            tiempoDesdeUltimoComando = Date.now();
            return;
        }
    }
})

client.login(token);