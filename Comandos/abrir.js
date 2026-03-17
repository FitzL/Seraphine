var dbclient;
var message;
var system;
var serafin;

const _mini = 55;
const _normal = 70;
const _grande = 120;
const robpct = 0.30;
const _bigL = 0.75;

const { Command } = require("../modulos/MCommand.js");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, MessageFlags } = require('discord.js');

const ChannelBlacklist =
  [
    "1126988705513619516",
    "1465094200839373024"
  ]
prototype = {
  alias: ["abrir", "box", "open", "caja", "ouvrir"], //nombre del comando
  descripcion: "Abre una o mas cajas.", // que hace
  costo: 0, //cuanto cuesta
  testing: false, //se está probando?
  cantidad: 1,
  init: async (args, _message, client, _system) => {
  },
  callback: async (args, _message, client, _system) => {
    system = _system
    dbclient = system.mongoclient;
    message = _message;
    serafin = await dbclient.findUser(client.user.id).catch((e) => { console.log });

    if (serafin.currency < 200) return message.reply("I don't have enough cookies!");

    if (ChannelBlacklist.includes(message.channel.id)) return message.reply(
      { content: `Go to another channel.`, flags: MessageFlags.Ephemeral }
    )

    if (isNaN(_message.author.dbuser.cajas) || _message.author.dbuser.cajas < 1) {
      _message.reply("No boxes fam");
      return;
    }

    if (args[0] === "all") args[0] = _message.author.dbuser.cajas;

    if (isNaN(args[0]) || args[0] == 1) return singleOpen();
    else if (_message.author.dbuser.cajas >= args[0]) {
      return multiOpen(_message.author.dbuser, args[0]);
    } else {
      message.reply("You don't got all that bruv");
    }
  }
}

let command = new Command(
  prototype.alias,
  prototype.descripcion,
  prototype.costo,
  prototype.testing,
  prototype.callback,
  prototype.init
)

const lt_A = {
  caja: 11_00,
  pifia: 10_00,
  mini: 30_00,
  mini_troll: 11_00,
  normal: 20_00,
  grande: 10_00,
  rob: 20,
  bigL: 40
}

let loottable = ProbabilityFromObject(lt_A);

// turn loottable into probabilities
function ProbabilityFromObject(obj) {
  let total = Object.values(obj).reduce((x, tally) => x + tally);
  let tally = 0;

  Object.entries(obj).forEach(([key, value]) => {
    let p_value = ~~Math.round(value * 100_000 / total) / 1_000;
    obj[key] = [p_value, tally];
    tally += p_value;
  });

  console.log(obj);

  return obj;
}

//Manage a single box opening
async function singleOpen() {
  let rndnumber = ~~(Math.random() * 100_000) / 1_000;
  let prize = "";

  Object.entries(loottable).forEach(([key, value]) => {
    if (rndnumber >= value[1]) {
      prize = key;
    }
  })

  console.log(prize);

  switch (prize) {
    case 'caja':
      await caja(message.author.dbuser)
        .catch((e) => { console.log; return });
      break;
    case 'mini':
      await mini(message.author.dbuser)
        .catch((e) => { console.log; return });
      break;
    case 'mini_troll':
      await mini_troll(message.author.dbuser)
        .catch((e) => { console.log; return });
      break;
    case 'normal':
      await normal(message.author.dbuser)
        .catch((e) => { console.log; return });
      break;
    case 'grande':
      await grande(message.author.dbuser)
        .catch((e) => { console.log; return });
      break;
    case 'rob':
      await rob(message.author.dbuser)
        .catch((e) => { console.log; return });
      break;
    case 'pifia':
      await pifia(message.author.dbuser)
        .catch((e) => { console.log; return });
      break;

    case 'bigL':
      await bigL(message.author.dbuser)
        .catch((e) => { console.log; return });
      break;
  }
  return;

}

// Opens multiple boxes
async function multiOpen(dbuser, amount) {
  await dbclient.addBox(dbuser._id, -amount).catch((e) => { console.log; throw "NO_BOXES" });
  let totalCurrency = 0;
  let totalBoxes = 0;
  var lotoMoney = ~~(serafin.currency * robpct);
  var loto = false;
  let luhmao = false;

  while (!luhmao && !loto && --amount && serafin.currency > 0 ) {
    if (amount < 1) break;
    let rndnumber = ~~(Math.random() * 100_000) / 1_000;
    let prize = "";

    Object.entries(loottable).forEach(([key, value]) => {
      if (rndnumber >= value[1]) {
        prize = key;
      }
    });

    switch (prize) {
      case 'caja':
        totalBoxes += ~~(Math.random() * 3) + 1;
        break;
      case 'mini':
        totalCurrency += _mini;
        break;
      case 'mini_troll':
        totalCurrency += _mini;
        break;
      case 'normal':
        totalCurrency += _normal;
        break;
      case 'grande':
        totalCurrency += _grande;
        break;
      case 'rob':
        console.log(loto);
        if (loto) {
          totalBoxes += 2;
          break;
        }

        loto = true;
        totalCurrency += lotoMoney;
        break;

      case 'bigL':
        totalCurrency -= Math.max(~~(dbuser.currency * _bigL), 1);
        luhmao = true;
        break;

      case 'pifia':
        totalCurrency -= _mini;
        break;
    }
  };
  let opening = "There were ";
  let closing = "inside. ";
  let lototxt = "AND YOU WON THE LOTERRY!";
  let bigltxt = "AND YOU GOT A BIG L!"

  console.log(totalCurrency, totalBoxes, amount)
  let embed = new system.embed()
    .setColor(message.member.displayColor)
    .setDescription(opening + totalCurrency + system.currency + " and " + totalBoxes + "📦 ");

  if (totalBoxes == 0) embed.setDescription(opening + totalCurrency + system.currency);

  if (loto == true) embed.setDescription(opening + totalCurrency + system.currency + " and " + totalBoxes + "📦 " + closing + lototxt);
  if (luhmao == true) embed.setDescription(opening + totalCurrency + system.currency + " and " + totalBoxes + "📦 " + closing + bigltxt);

  dbclient.addBox(dbuser._id, totalBoxes + amount);

  dbclient.transferCurrency(serafin._id, dbuser._id, totalCurrency).catch((err) => {
    console.log(err)
    if (err == "NEGATIVE") {
      dbclient.transferCurrency(dbuser._id, serafin._id, -totalCurrency)
    }
  })
  

  return await message.channel.send({ embeds: [embed] });
}

// Methods for single Box opening
async function caja(dbuser) {
  await dbclient.addBox(dbuser._id, -1).catch((e) => { console.log; throw "NO_BOXES" });

  let boxes = ~~(Math.random() * 3) + 1;
  dbclient.addBox(dbuser._id, boxes);
  let embed = new system.embed()
    .setColor(message.member.displayColor)
    .setDescription("There were " + boxes + "📦 inside the box (?");
  return message.channel.send({ embeds: [embed] });
}

async function mini(dbuser) {
  await dbclient.addBox(dbuser._id, -1).catch((e) => { console.log; throw "NO_BOXES" });
  dbclient.transferCurrency(serafin._id, dbuser._id, _mini);

  let embed = new system.embed()
    .setColor(message.member.displayColor)
    .setDescription("<@" + message.author.id + "> you got " + _mini + system.currency);

  return message.channel.send({ embeds: [embed] });
}
async function mini_troll(dbuser) {
  message.member.timeout(10_000).catch(async (e) => {
    console.log
  })

  let embed = new system.embed()
    .setColor(message.member.displayColor)
    .setDescription("<@" + message.author.id + "> chu!");

  return message.channel.send({ embeds: [embed] });
}
async function normal(dbuser) {
  await dbclient.addBox(dbuser._id, -1).catch((e) => { console.log; throw "NO_BOXES" });
  dbclient.transferCurrency(serafin._id, dbuser._id, _normal);

  let embed = new system.embed()
    .setColor(message.member.displayColor)
    .setDescription("<@" + message.author.id + "> you got " + _normal + system.currency);

  return message.channel.send({ embeds: [embed] });
}

async function bigL(dbuser, defer = false) {
  if (!defer) await dbclient.addBox(dbuser._id, -1).catch((e) => { console.log; throw "NO_BOXES" });
  console.log("Takinga away this much: " + Math.max(~~(dbuser.currency * _bigL), 1));
  dbclient.transferCurrency(dbuser._id, serafin._id, Math.max(~~(dbuser.currency * _bigL), 1));

  let embed = new system.embed()
    .setColor(message.member.displayColor)
    .setDescription("<@" + message.author.id + "> you got -" + Math.max(~~(dbuser.currency * _bigL), 1) + system.currency);

  return message.channel.send({ embeds: [embed] });
}

async function grande(dbuser) {
  await dbclient.addBox(dbuser._id, -1).catch((e) => { console.log; throw "NO_BOXES" });
  dbclient.transferCurrency(serafin._id, dbuser._id, _grande);

  let embed = new system.embed()
    .setColor(message.member.displayColor)
    .setDescription("<@" + message.author.id + "> you got " + _grande + system.currency);

  return message.channel.send({ embeds: [embed] });
}
async function rob(dbuser) {
  await dbclient.addBox(dbuser._id, -1).catch((e) => { console.log; throw "NO_BOXES" });

  let serafin = await dbclient.findUser("1316479184050192384").catch((e) => { console.log });
  console.log(serafin);
  let amount = ~~(serafin.currency * robpct);

  console.log(amount, serafin);

  await dbclient.transferCurrency(serafin._id, message.author.id, amount);

  let embed = new system.embed()
    .setColor(message.member.displayColor)
    .setDescription("<@" + message.author.id + "> you got " + `${robpct * 100}%` + system.currency + ` off my cookies(${amount + system.currency}) :3`);

  return message.channel.send({ embeds: [embed] });
}

async function pifia(dbuser) {
  await dbclient.addBox(dbuser._id, -1).catch((e) => { console.log; throw "NO_BOXES" });
  await dbclient.transferCurrency(dbuser._id, serafin._id, _mini);
  console.log("it went through")

  let embed = new system.embed()
    .setColor(message.member.displayColor)
    .setDescription("<@" + message.author.id + "> you got " + `-${_mini}` + system.currency + `! <:raoralaugh:1343492065954103336>`);

  console.log(embed, 'embed');
  return message.channel.send({ embeds: [embed] });
}

module.exports = command;