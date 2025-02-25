const fs = require('fs');
const path = require('path');
const dir = 'comandos';

const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

const { ownerid, token } = require('./secret.json');
const { dbUser, mongoClient } = require('./db/db.js');
let comandos = [];
let tiempoDesdeUltimoComando = Date.now();

let ultimoPersonaje = 0;
let rechazos = [
    "Matate",
    "No quiero",
    "Maricon",
    "Luego",
    "Puto"
];

var message;
var prefix = "s!";

var sistema = {
    ultimoPersonaje: ultimoPersonaje,
    dbuser: dbUser,
    mongoclient: mongoClient,
    onwerid: ownerid,
    serafin: null,
    currency: "🥖",
    embed: EmbedBuilder,
    getMember: getMember,
    lockdown: false
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

    // just connects to mongo database
    mongoClient.connect().then(async () => {
        console.log("Connected to the database.");
    }).catch((err) => {
        console.log("There's been an error connecting to the database :(");
    }).finally(async () => {
        sistema.serafin = await mongoClient.findUser(client.user.id);
        sistema.currency = sistema.serafin.serverCurrency;
        sistema.lockdown = sistema.serafin.lockdown;
    });
})

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
})

client.on('messageCreate', async (_message) => {
    message = _message;
    let messageDate = new Date(message.createdTimestamp);

    if (message.author.bot && message.author.id != "1316479184050192384") return;

    let messageTokens = message.content.split(/\s+/);

    console.log(`${message.author.username} @` + messageDate.getHours() + ":" + messageDate.getMinutes());

    // find bot member object in server
    client.member = await message.guild.members.fetch(client.user.id);

    // find message author in db
    let dbuser = await mongoClient.findUser(message.author.id).catch((e) => { console.log });

    // join the author (db) with the author (discord)
    if (!await mongoClient.findUser(message.author.id).catch((e) => { console.log })) {
        dbuser = new dbUser(message.author.id, message.author.username);
        await mongoClient.insertUser(dbuser);
        message.author.dbuser = dbuser;

        console.log("couldn't find db user, making one...");
    } else {
        message.author.dbuser = new dbUser(
            dbuser._id.toString(),
            dbuser.username,
            dbuser.xp,
            dbuser.lvl,
            dbuser.currency,
            dbuser.lastActivity,
            dbuser.nextXp,
            dbuser.nextPay,
        );
    }

    //user updates
     
    if (message.author.id != ownerid && sistema.lockdown) return;

    let update;
    await handleUserUpdates(message.author.dbuser).then(async (_update) => { update = _update });
    message.author.dbuser = update.user;

    //notifs
    //if (update.lvlup) await message.react("🆙");


    if (message.author.bot) return;

    //react if mentioned
    let ser = new RegExp("<@1316479184050192384>|1316479184050192384|" + client.member.nickname + "|" + client.user.username);

    if (message.content.match(ser)) message.react("<:gatowtf:1129239829549420584>");

    //escape if no prefix (may changed it later)
    if (messageTokens.length < 1) return; //check for empty messages
    let primer = messageTokens[0].slice(0, prefix.length);
    let command;

    if (primer == prefix && messageTokens[0].length > prefix.length) {
        command = messageTokens[0].slice(prefix.length);
        messageTokens.shift();
    }
    else if (messageTokens[0].toLowerCase() == "sera" || messageTokens[0].toLowerCase() == "s!") {
        command = messageTokens[1];
        messageTokens.shift();
        messageTokens.shift();
    }
    else return;

    for (const commandOptions of comandos) {
        //the things we care about commands
        let {
            alias,
            descripcion,
            testing,
            callback,
            costo = 0,
        } = commandOptions;

        let cobrar = false;

        for (const _alias of alias) {
            //escape loop
            if (command.toLowerCase() != _alias) continue;

            //just fucks with the user 
            // this really just fucks with me more than any random user
            if (Math.random() < 0.075) {
                return message.reply(rechazos[~~(rechazos.length * Math.random())])
            };

            //limit who can mess with wip commands
            if (testing && (message.author.id != ownerid)) {
                message.reply("No, jodete.");
                message.channel.send("<:ayweno:1167952675158110308>");
                return;
            }

            // command cooldown
            if (((message.createdTimestamp - tiempoDesdeUltimoComando)) < 2_000) {
                return message.reply("Dame un segundo.").then(m => { setTimeout(() => { m.delete() }, 3_500) });
            }

            try {
                //manage commands with a price
                if (costo > 0) cobrar = true;
                console.log(costo);
                if (costo > message.author.dbuser.currency && cobrar) {
                    message.reply("No le hago caso a gente pobre").then(m => {
                        message.channel.send("<:raoralaugh:1343492065954103336>");
                        setTimeout(() => {
                            m.reply("Pero lo haría por unos " + costo + sistema.currency + " :3");
                        }, 2_000);
                    });

                    throw "not enough funds";
                }


                // run command callback, may return a reply to the user
                await callback(messageTokens, message, client, sistema).catch(e => {
                    console.log(e);
                    cobrar = false;
                }).then(async () => {
                    // actually take the fee
                    if (cobrar) {
                        let embed = new EmbedBuilder()
                            .setColor(client.member.displayColor)
                            .setDescription("-" + costo + sistema.currency)

                        await mongoClient.transferCurrency(message.author.id, client.user.id, costo); //taxes
                        message.channel.send({embeds: [embed]});
                    }
                });
                //if (reply) message.reply(reply);
            } catch (err) {
                console.log(err);
            }

            //update last commando counter
            tiempoDesdeUltimoComando = Date.now();
            break;
        }

    }
})

client.login(token);

//helper functions

function getMember(id) {
    if (!id) return null;
    return message.guild.members.fetch(id);
}

async function handleUserUpdates(user) {
    let prevLvl = user.lvl;

    await mongoClient.updateUser(user._id, "lastActivity", Date.now());

    await mongoClient.updateUser(user._id, "xp", user.updateXp());
    await mongoClient.updateUser(user._id, "lvl", user.updateLvl(message, "🆙"));
    await mongoClient.updateUser(user._id, "currency", await user.updateCurrency(message, sistema.currency));

    await mongoClient.updateUser(user._id, "nextXp", user.nextXp);
    await mongoClient.updateUser(user._id, "nextPay", user.nextPay);

    let updateduser = await mongoClient.findUser(user._id).catch((e) => { console.log });

    updateduser = await new dbUser(
        updateduser._id,
        updateduser.username,
        updateduser.xp,
        updateduser.lvl,
        updateduser.currency,
        updateduser.lastActivity,
        updateduser.nextXp,
        updateduser.nextPay
    );

    let lvlup = updateduser.lvl > prevLvl;

    return {
        user: updateduser,
        lvlup: lvlup
    };
}
