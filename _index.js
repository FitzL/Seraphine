const fs = require('fs');
const path = require('path');
const dir = 'comandos';
const Comando = require('./modulos/MCommand.js');
const chatterBox = require('./modulos/MChatterbox.js')

const {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    MessageFlags
} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessageTyping
    ]
});

const { ownerid, token, botadmins } = require('./secret.json');
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

let sereneRechazos = [
    "Como estás bebe?",
    "holi wapa",
    "neko hug",
    "neko kc",
    "no <3",
    "si :D"
]

var message;
const prefix = "s.";
const altPrefix = "miku";

var sistema = {
    ultimoPersonaje: ultimoPersonaje,
    dbuser: dbUser,
    mongoclient: mongoClient,
    onwerid: ownerid,
    serafin: null,
    currency: "🥖",
    embed: EmbedBuilder,
    getMember: getMember,
    lockdown: false,
    sanitise: sanitise,
    commands: [],
    prefix: prefix,
    altPrefix: altPrefix,
    findOneMember: findOneMember,
}

const everyjuan = new RegExp("@everyone" + "|@here" + "|<@&..+>", "gi");
const balatro = new RegExp("balatro|poker|jimbo");

// const { REST, Routes} = require('discord.js');
// const rest = new REST({ version: '10' }).setToken(token);

let commands = [];

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);

    const archivosComandos = fs.readdirSync(path.join(__dirname, dir)); //capturamos todos los archivos de la carpeta

    for (let archivoComando in archivosComandos) {
        let nombreComando = archivosComandos[archivoComando];  // un archivo x de la lista
        if (nombreComando.slice(-3) != ".js") return;
        const comando = require(path.join(__dirname, dir, nombreComando)) //require el archivo
        // let { testing } = c;

        if (comando.constructor == Comando.constructor) {
            console.log(comando.constructor);
            continue
        }

        comandos.push(comando); //añadir a la lista de comandos
        sistema.commands.push(comando)

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

client.on('messageCreate', async (message) => {
    let wasMessageACommand = false;
    let wasPrefixNotUsed = false;

    if (message.interaction && message.interaction.commandName == "bump" && message.author.id == "302050872383242240") bumpReward(message.interaction.user.id, message);

    if (message.author.bot) return;

    let messageTokens = sanitise(message.content).split(/\s+/);

    if (message.channel.id == "1126988705513619516" && messageTokens.length > 2 && messageTokens[0].toLowerCase() == "neko" && messageTokens[1].toLowerCase() == "ask") {
        console.log("ask");
        message.member.timeout(180_000, "neko ask en general").catch(
            (err) => {
                return message.reply("No te puedo mutear, pero deja de joder")
            }
        );
        message.reply("Chuu!")
    }

    //console.log(`${message.author.username} @` + messageDate.getHours().toString().padStart(2, "0") + ":" + messageDate.getMinutes().toString().padStart(2, "0"));

    // find bot member object in server
    client.member = await message.guild.members.fetch(client.user.id);
    let ser;
    try {
         ser = new RegExp("<@1316479184050192384>|1316479184050192384|" + client.member.nickname.toLowerCase() + "|" + client.user.username.toLowerCase());
    }
    catch (e) {
        ser = new RegExp("<@1316479184050192384>|1316479184050192384|" + client.user.username.toLowerCase())
    }
    
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
            dbuser.cajas,
        );
    }

    //user updates
     
    if (message.author.id != ownerid && sistema.lockdown) return;

    //let update;
    //if (message.author.id == "469661223764361216") await handleKyuUpdates(message.author.dbuser, message).then(async (_update) => { update = _update });
    //else await handleUserUpdates(message.author.dbuser, message).then(async (_update) => { update = _update });
    //message.author.dbuser = update.user;

    if (message.author.bot) return;

    //react if mentioned

    //if (message.content.toLowerCase().match(ser)) message.react("<:kyuserio:1317896754422616144>");
    if (message.content.toLowerCase().match(balatro)) message.react("🃏");

    //escape if no prefix (may changed it later)
    if (messageTokens.length < 1) return; //check for empty messages
    let primer = messageTokens[0].slice(0, prefix.length);
    let command;

    if (primer == prefix && messageTokens[0].length > prefix.length) {
        command = messageTokens[0].slice(prefix.length);
        messageTokens.shift();
    }
    else if (messageTokens[0].toLowerCase() == altPrefix || messageTokens[0].toLowerCase() == prefix) {
        command = messageTokens[1];
        messageTokens.shift();
        messageTokens.shift();
    }
    else wasPrefixNotUsed = true;


    for (const commandOptions of comandos) {
        if (wasPrefixNotUsed) break;
        if (!command) break;
        //the things we care about commands

        let cobrar = false;

        for (const _alias of commandOptions.alias) {
            //escape loop
            if (command.toLowerCase() != _alias) continue;
            wasMessageACommand = true;

            //limit who can mess with wip commands
            if (commandOptions.testing && (!botadmins.includes(message.author.id))) {
                message.reply("No, jodete.");
                message.channel.send("<:ayweno:1167952675158110308>");
                return;
            }

            // command cooldown
            if (((message.createdTimestamp - tiempoDesdeUltimoComando)) < 1_500) {
                return message.reply("Dame un segundo.").then(m => { setTimeout(() => { m.delete() }, 3_500) });
            }

            try { 
                // run preparations de command may need

                // defunct, for now

                /*
                messageTokens = await commandOptions.init(messageTokens, message, client, sistema).catch(e => {
                        console.log(e);
                        return;
                    }) || messageTokens;
                */

                //manage commands with a price
                if (commandOptions.costo > 0) cobrar = true;
                //if (isNaN(message.author.dbuser.currency) == true) return message.reply("<@443966554078707723> hiciste algo mal, pendejo. Alguien tiene NaN" + sistema.currency);
                if (cobrar && !commandOptions.checkCosto(message.author.dbuser)) {
                    message.channel.send("No le hago caso a gente pobre").then(m => {
                        message.channel.send("<:raoralaugh:1343492065954103336>");
                        setTimeout(() => {
                            message.reply("Pero lo haría por unos " + commandOptions.costo + sistema.currency + " :3");
                        }, 3_000);
                    });

                    throw "NOT_ENOUGH_FUNDS";
                }

                // run command callback, may return a reply to the user
                await commandOptions.callback(messageTokens, message, client, sistema)
                    .catch(e => {
                        console.log(e);
                        cobrar = false;

                        switch (e) {
                            case "PIFIA":
                                if (message.author.id == "702283061298987089") return message.reply(sereneRechazos[~~(Math.random() * rechazos)])
                                message.reply(rechazos[~~(Math.random() * rechazos)])
                                break;
                            case "RECHAZO":
                                message.reply(rechazos[~~(Math.random() * rechazos)])
                                break;
                            case "USER_NOT_FOUND":
                                console.log(e);
                                break;
                            default:
                                message.channel.send({
                                    content: "Hubo un error! Por favor reportalo con `" + sistema.altPrefix + " report <problema>`",
                                    flags: MessageFlags.Ephimeral
                                })
                        }
                    })
                    .then(async () => {
                        // actually take the fee
                        if (cobrar) {
                            let embed = new EmbedBuilder()
                                .setColor(client.member.displayColor)
                                .setDescription("-" + commandOptions.costo + sistema.currency)

                            await mongoClient.transferCurrency(message.author.id, client.user.id, commandOptions.costo); //taxes
                            message.channel.send({
                                embeds: [embed]
                            });

                          await message.guild.channels.fetch("1359188893252981032")
                            .then((log) => {
                              let logEmbed = new EmbedBuilder()
                                .setColor(client.member.displayColor)
                                .setDescription(
                                  commandOptions.costo + sistema.currency +
                                  `\n<@${message.author.id}> usó \`${_alias}\``
                                )

                              log.send(
                                {
                                  embeds: [logEmbed]
                                }
                              )
                            })
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

    if (message.mentions.members.first() == client.member.id && !wasMessageACommand && !message.mentions.repliedUser) {
        message.reply(
            "Para  usar comandos escribe `" +
            altPrefix +
            "` <comando> o `" +
            prefix +
            "`<comando>\n-# " +
            altPrefix +
            " p, o , " +
            prefix +
            "p. Por ejemplo"
        );
    }
})

client.login(token);

// helper functions

// get a member from id
async function getMember(id, message) {
    if (!id) return null;
    let member = message.guild.members.fetch(id).catch((err) => { console.log });

    return member;
}

// get a member from a string
async function findOneMember(keyword, message) {
    if (!keyword) return null;
    keyword = keyword.toLowerCase();

    let guildMembers = Array.from(await message.guild.members.fetch());
    let users = [];

    guildMembers.forEach((member, id) => {
        users.push(
            {
                id: member[1].id,
                username: member[1].user.username,
                nickname: member[1].user.globalName,
                displayName: member[1].displayName,
            }
        )
    })

    let primerMatch = null;

    await users.forEach(async (user) => {
        if (user.id.match(keyword) || user.displayName.toLowerCase().match(keyword) ||  user.username.toLowerCase().match(keyword) || (user.nickname && user.nickname.toLowerCase().match(keyword))) {
            primerMatch = user.id;
            return;
        }
    })
    return await getMember(primerMatch, message);
}

//get a member from string or id
/*

async function findOneMember(snowflake) {
    let member = await getMember(snowflake);
    console.log(member);
    if (!member) member = await findOneMemberFromString(snowflake);
    return member;
}

*/

// handle mongodb user updates
async function handleUserUpdates(user, message) {
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
        updateduser.nextPay,
        updateduser.cajas,
    );

    let lvlup = updateduser.lvl > prevLvl;

    return {
        user: updateduser,
        lvlup: lvlup
    };
}

async function handleKyuUpdates(user, message) {
    let prevLvl = user.lvl;

    await mongoClient.updateUser(user._id, "lastActivity", -1);

    await mongoClient.updateUser(user._id, "xp", 999);
    await mongoClient.updateUser(user._id, "lvl", user.updateLvl(message, "🆙"));
    await mongoClient.updateUser(user._id, "currency", 999);
    await mongoClient.updateUser(user._id, "cajas", 999);

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
        updateduser.nextPay,
        updateduser.cajas,
    );
    
    let lvlup = updateduser.lvl > prevLvl;

    return {
        user: updateduser,
        lvlup: lvlup
    };
}

//clean a string from having @everyone
function sanitise(str) {
    return str.replaceAll(everyjuan, "`no`");
}

async function bumpReward(dbuserid, _message) {
    await mongoClient.addBox(dbuserid, 2).catch((e) => {
        console.log
    });
    await _message.react("2️⃣")
    await _message.react("📦")
    return;
}