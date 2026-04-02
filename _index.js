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
  MessageFlags,
  SlashCommandBuilder
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
const { dbUser, mongoClient, Timer, Effect } = require('./db/db.js');
const { channel } = require('diagnostics_channel');
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

let cocks = [
  "girlcockx",
  "fxtwitter"
]

let rejectChance = 0.03;
let rejections = [
  "Can you ask again?",
  "Are you sure?",
  "I don't wanna",
  "I'm busy rn",
  "Ask teto",
  "Do I really have to do that?",
  "Do it yourself",
  "?",
  "<:zzzz:1351003550398025789>",
  "Yikesss that's too much work for Miku",
  "I want to get a green onion and dance, not do that"
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
const prefix = "m.";
const altPrefix = "miku";

var sistema = {
  ultimoPersonaje: ultimoPersonaje,
  dbuser: dbUser,
  mongoclient: mongoClient,
  onwerid: ownerid,
  serafin: null,
  currency: " 🥖",
  embed: EmbedBuilder,
  getMember: getMember,
  lockdown: false,
  sanitise: sanitise,
  commands: [],
  prefix: prefix,
  altPrefix: altPrefix,
  findOneMember: findOneMember,
  logChannel: null,
}

const everyjuan = new RegExp("@everyone|@here|<@&..+>", "gi");
const balatro = new RegExp("balatro|poker|jimbo");
const lichessGame = new RegExp(
  "(?:https:/.+?lichess\..+?/)([a-z0-9]+)(?:/)(.+)(?:#[0-9]+)" +
  "|(?:https:/.+?lichess\..+?/)([a-z0-9]+)(?:/)?", "gmi");

const xitter = /(https:\/.?)(x)(\..+\/.+\/status\/.+)(\?)?\s|(https:\/.?)(twitter)(\..+\/.+\/status\/.+)(\?)?\s/gm;

const { REST, Routes} = require('discord.js');
const rest = new REST({ version: '10' }).setToken(token);

let commands = [];
let slashCommands = [];

const LogChannel = "1359188893252981032";
let log;

client.on('guildMemberAdd', async () => {
  console.log("joined");

})

client.on('guildMemberRemove', async (member) => {
  const joinedAt = member.joinedAt;

  if (!joinedAt) return console.log('No join date available');

  const timeInServer = Date.now() - joinedAt.getTime();

  console.log(timeInServer/1000 + " seconds in server");
})

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);

  console.log(client.user)

  if (client.user.id != "1316479184050192384") {
    sistema.altPrefix = "neru"
    sistema.prefix = "n."
  }

  console.log(sistema)

  log = await client.channels.fetch(LogChannel);
  sistema.logChannel = log

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

  //handle timers

  // infinite loop, should run once a second
  while (true) {
    let timers = await mongoClient.getAllTimers();

    for (let timer of timers) {
      let time = timer.createdAt + timer.duration * 1000 - Date.now();
      if (timer.handled) continue;
      if (time < 0) {
        timer.handled = true;
        await mongoClient.deleteTimer(timer._id);
        let timerChannel = client.channels.cache.get(timer.channelId);
        await timerChannel.send(`Time's up <@${timer.owner}>!` + timer.message);

        console.log("time's up!", timerChannel.id)
      } 
    }
    await sleep(1_000);

    // slash commands
    await comandos.forEach(c => {
      slashCommands.push(
        new SlashCommandBuilder()
          .setName(c.alias[0])
          .setDescription(c.help.slice(0, 100) || "ask the dev")
          .addStringOption(o => 
            o
              .setName('text')
              .setDescription('description')
          )
      )
    })

    slashCommands.map(c => c.toJSON())

    try {
      await rest.put(
        //Routes.applicationGuildCommands(client.user.id, "1125975138987429908"), // uncomment for dev
        Routes.applicationCommands(client.user.id),
        { body: slashCommands }
      )
    } catch (e) {
      console.log
    }

    console.log()
  }
})

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  return interaction.reply("this is under wip.");

  let command = interaction.commandName;
  let args = interaction.options.getString('text');

  args = sanitise(args).split(/\s+/);

  return console.log(interaction)

  for (const commandOptions of comandos) {
    if (command.toLowerCase() != command) continue;

    let cobrar = false;

    for (const _alias of commandOptions.alias) {
      //limit who can mess with wip commands
      if (commandOptions.testing && (!botadmins.includes(message.author.id))) {
        message.reply("No, you're not allowed.");
        message.channel.send("<:ayweno:1167952675158110308>");
        return;
      }

      // command cooldown
      if (((message.createdTimestamp - tiempoDesdeUltimoComando)) < 1_250) {
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

        //reject commands randomly!
        if (Math.random() < rejectChance) {
          message.channel.send(rejections[~~(Math.random() * rejections.length)]);
          throw "REJECTED"
        }

        //manage commands with a price
        if (commandOptions.costo > 0) cobrar = true;
        //if (isNaN(message.author.dbuser.currency) == true) return message.reply("<@443966554078707723> hiciste algo mal, pendejo. Alguien tiene NaN" + sistema.currency);
        if (cobrar && !commandOptions.checkCosto(message.author.dbuser)) {
          message.channel.send("I don't listen to poor people.").then(m => {
            message.channel.send("<:raoralaugh:1343492065954103336>");
            setTimeout(() => {
              message.reply("I'd do it for " + commandOptions.costo + sistema.currency + " tho :3");
            }, 3_000);
          });

          throw "NOT_ENOUGH_FUNDS";
        }

        // run command callback, may return a reply to the user
        await commandOptions.callback(messageTokens, interaction, client, sistema)
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
              case "DEFERED":
              case "USER_NOT_FOUND":
                break;
              default:
                message.channel.send({
                  content: "There has been an error! You can report it with: `" + sistema.altPrefix + " report <problem>` so the dev can ignore you.",
                  flags: MessageFlags.Ephimeral
                })
            }
          })
          .then(async () => {
            // actually take the fee
            if (cobrar) {
              let embed = new EmbedBuilder()
                .setColor(client.member.displayColor)
                .setDescription("+" + commandOptions.costo + sistema.currency + " to me.")

              await mongoClient.transferCurrency(message.author.id, client.user.id, commandOptions.costo); //taxes
              message.channel.send({
                embeds: [embed]
              });

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
        return message.reply("I can't mute you, stahp")
      }
    );
    message.reply("Chuu!")
  }

  //console.log(`${message.author.username} @` + messageDate.getHours().toString().padStart(2, "0") + ":" + messageDate.getMinutes().toString().padStart(2, "0"));

  // find bot member object in server
  client.member = await message.guild.members.fetch(client.user.id);
  let ser;
  try {
    ser = new RegExp("<@" + client.user.id + ">|" + client.user.id + "|" + client.member.nickname.toLowerCase() + "|" + client.user.username.toLowerCase());
  }
  catch (e) {
    ser = new RegExp("<@" + client.user.id + ">|" + client.user.id + "|" + client.user.username.toLowerCase())
  }

  // find message author in db
  let dbuser = await mongoClient.findUser(message.author.id).catch((e) => { console.log; console.log("user not found", message.author.id) });

  // join the author (db) with the author (discord)
  if (!mongoClient.findUser(message.author.id).catch((e) => { console.log })) {
    return;
    dbuser = new dbUser(message.author.id, message.author.username);
    mongoClient.insertUser(dbuser);
    message.author.dbuser = dbuser;

    console.log("couldn't find db user, making one...");
  } else {
    try {
      message.author.dbuser = dbuser;
    } catch (e) {
      console.log(e);
      return;
    }
  }

  //user updates

  if (message.author.id != ownerid && sistema.lockdown) return;

  //let update;
  //if (message.author.id == "469661223764361216") await handleKyuUpdates(message.author.dbuser, message).then(async (_update) => { update = _update });
  //else await handleUserUpdates(message.author.dbuser, message).then(async (_update) => { update = _update });
  //message.author.dbuser = update.user;

  //do effects if available

  let effects = await message.author.dbuser.getEffects();

  for (let effect of effects) {
    if (effect.checkTime()) {
      mongoClient.deleteEffect(effect._id);
      message.reply("I ran out of " + effect.emoji + "'s for you.");
      continue;
    }
    try {
      effect.react(message);
    } catch (err) {
      console.log
    }
  }

  if (message.author.bot) return;

  //react if mentioned

  if (message.content.toLowerCase().match(ser)) message.react("<:kyuserio:1317896754422616144>");
  if (message.content.toLowerCase().match(balatro)) message.react("🃏");
  if (message.content.toLowerCase().match(lichessGame)) {
    await message.channel.send(await LichessGiffer(message.content));
  };
  if (message.content.toLowerCase().match(xitter)) {
    await message.channel.send(GirlCock(message.content));
    return //await message.delete();
  };

  //escape if no prefix (may changed it later)
  if (messageTokens.length < 1) return; //check for empty messages
  let primer = messageTokens[0].slice(0, sistema.prefix.length);
  let command;

  if (primer == sistema.prefix && messageTokens[0].length > sistema.prefix.length) {
    command = messageTokens[0].slice(sistema.prefix.length);
    messageTokens.shift();
  }
  else if (messageTokens[0].toLowerCase() == sistema.altPrefix || messageTokens[0].toLowerCase() == sistema.prefix) {
    command = messageTokens[1];
    messageTokens.shift();
    messageTokens.shift();
  }
  else wasPrefixNotUsed = true;

  //check how the bot is doing
  sistema.serafin = await mongoClient.findUser(client.user.id);
  sistema.currency = sistema.serafin.serverCurrency;

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
        message.reply("No, you're not allowed.");
        message.channel.send("<:ayweno:1167952675158110308>");
        return;
      }

      // command cooldown
      if (((message.createdTimestamp - tiempoDesdeUltimoComando)) < 1_250) {
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

        //reject commands randomly!
        if (Math.random() < rejectChance) {
          message.channel.send(rejections[~~(Math.random() * rejections.length)]);
          throw "REJECTED"
        }


        //manage commands with a price
        if (commandOptions.costo > 0) cobrar = true;
        //if (isNaN(message.author.dbuser.currency) == true) return message.reply("<@443966554078707723> hiciste algo mal, pendejo. Alguien tiene NaN" + sistema.currency);
        if (cobrar && !commandOptions.checkCosto(message.author.dbuser)) {
          message.channel.send("I don't listen to poor people.").then(m => {
            message.channel.send("<:raoralaugh:1343492065954103336>");
            setTimeout(() => {
              message.reply("I'd do it for " + commandOptions.costo + sistema.currency + " tho :3");
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
              case "DEFERED":
              case "USER_NOT_FOUND":
                break;
              default:
                message.channel.send({
                  content: "There has been an error! You can report it with: `" + sistema.altPrefix + " report <problem>` so the dev can ignore you.",
                  flags: MessageFlags.Ephimeral
                })
            }
          })
          .then(async () => {
            // actually take the fee
            if (cobrar) {
              let embed = new EmbedBuilder()
                .setColor(client.member.displayColor)
                .setDescription("+" + commandOptions.costo + sistema.currency + " to me.")

              await mongoClient.transferCurrency(message.author.id, client.user.id, commandOptions.costo); //taxes
              message.channel.send({
                embeds: [embed]
              });

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
      "To use commands type `" +
      sistema.altPrefix +
      "` <command> o `" +
      sistema.prefix +
      "`<command>\n-# " +
      sistema.altPrefix +
      " p, or , " +
      sistema.prefix +
      "p. For example."
    );
  }
})

client.login(token);

// helper functions

// get a member from id
async function getMember(id, message) {
  if (!id) return null;

  let member = message.guild.members.cache.get(id).catch((err) => { console.log });

  return member;
}

// get a member from a string
async function findOneMember(keyword, message) {
  if (!keyword || keyword === undefined) return undefined;
  keyword = await keyword.toLowerCase();

  let guildMembers = cachedUsers;
  if (guildMembers.length < 1) {
    guildMembers = Array.from(message.guild.members.cache);
    cachedUsers = guildMembers;
  }
  let users = [];

  guildMembers.forEach((member, id) => {
    users.push(
      {
        id: member[1].id,
        username: member[1].user.username ?? "xox",
        nickname: member[1].user.globalName ?? "xox",
        displayName: member[1].displayName ?? "xox",
      }
    )
  })

  console.log(keyword)
  users.forEach((u) => {
    console.log(
      u.id.match(new RegExp(keyword, "i")), u.id,
      u.nickname.match(new RegExp(keyword, "i")), u.nickname,
      u.username.match(new RegExp(keyword, "i")), u.username,
      u.displayName.match(new RegExp(keyword, "i")), u.displayName
    )
  })

  let primerMatch;

  users.forEach(async (user) => {
    if (
      u.id.match(new RegExp(keyword, "i")) ||
      u.nickname.match(new RegExp(keyword, "i")) ||
      u.username.match(new RegExp(keyword, "i")) ||
      u.displayName.match(new RegExp(keyword, "i")) 
    ) {
      primerMatch = user.id;
      return;
    }
  })

  if (!primerMatch) {
    cachedUsers = [];
  }

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

  updateduser = new dbUser(
    updateduser._id,
    updateduser.username,
    updateduser.xp,
    updateduser.lvl,
    updateduser.currency,
    updateduser.lastActivity,
    updateduser.nextXp,
    updateduser.nextPay,
    updateduser.cajas
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

  updateduser = new dbUser(
    updateduser._id,
    updateduser.username,
    updateduser.xp,
    updateduser.lvl,
    updateduser.currency,
    updateduser.lastActivity,
    updateduser.nextXp,
    updateduser.nextPay,
    updateduser.cajas
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
  switch (~~(Math.random() * 3)) {
    case 0:
      await mongoClient.addBox(dbuserid, 1).catch((e) => {
        console.log
      });

      await _message.react("1️⃣")
      await _message.react("📦")
      break;
    case 1:
      await mongoClient.addBox(dbuserid, 2).catch((e) => {
        console.log
      });

      await _message.react("2️⃣")
      await _message.react("📦")
      break;

    case 2:
      await mongoClient.addBox(dbuserid, 3).catch((e) => {
        console.log
      });

      await _message.react("3️⃣")
      await _message.react("📦")
      break;
}}

function LichessGiffer(msg) {
  let groups = [...msg.matchAll(lichessGame)].flat().filter(n => n !== undefined);
  console.log(groups)
  if (groups[2] != undefined)
    return `https://lichess1.org/game/export/gif/${groups[2]}/${groups[1].substring(0, 8)}.gif`
  return `https://lichess1.org/game/export/gif/white/${groups[1].substring(0, 8)}.gif`
}

function GirlCock(msg) {
  let groups = [...msg.matchAll(xitter)].flat().filter(n => n !== undefined);
  console.log(groups);
  return groups[1] + cocks[~~(Math.random() * cocks.length)] + groups[3];
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}