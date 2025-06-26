var dbclient;
var message;
var system;
var serafin;

const _mini = 60;
const _normal = 75;
const _grande = 150;
const robpct = 0.15;

const { Command } = require("../modulos/MCommand.js");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, MessageFlags } = require('discord.js');

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
        serafin = await dbclient.findUser("1316479184050192384").catch((e) => { console.log });

        if (message.channel.id == "1126988705513619516") return message.reply(
            { content: `Por favor ve a otro canal`, flags: MessageFlags.Ephemeral }
        )

        if (isNaN(_message.author.dbuser.cajas) || _message.author.dbuser.cajas < 1) {
            _message.reply("No tenés cajas, 'ché");
            return;
        }

        if (args[0] === "all") args[0] = _message.author.dbuser.cajas;

        if (isNaN(args[0]) || args[0] == 1) return singleOpen();
        else if (_message.author.dbuser.cajas >= args[0]) {
            return multiOpen(_message.author.dbuser, args[0]);
        } else {
            message.reply("No tenés tantas cajas, 'ché");
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
    mini_troll: 10_00,
    normal: 25_00,
    grande: 10_00,
    rob: 2,
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

    while (amount--) {
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
            case 'pifia':
                totalCurrency -= _mini;
                break;
        }
    };
    console.log(totalCurrency, totalBoxes)
    let embed = new system.embed()
        .setColor(message.member.displayColor)
        .setDescription("Habían " + totalCurrency + system.currency + " y " + totalBoxes + "📦" + " dentro.");

    if (totalBoxes == 0) embed.setDescription("Habían " + totalCurrency + system.currency + " dentro.");

    if (loto == true) embed.setDescription("Habían " + totalCurrency + system.currency + " y " + totalBoxes + "📦" + " dentro. Y ganaste la lotería.");;

    dbclient.addBox(dbuser._id, totalBoxes);
    dbclient.transferCurrency(serafin._id, dbuser._id, totalCurrency);

    return message.channel.send({ embeds: [embed] });
}


// Methods for single Box opening
async function caja(dbuser) {
    await dbclient.addBox(dbuser._id, -1).catch((e) => { console.log; throw "NO_BOXES" });

    let boxes = ~~(Math.random() * 3) + 1;
    dbclient.addBox(dbuser._id, boxes);
    let embed = new system.embed()
        .setColor(message.member.displayColor)
        .setDescription("Habían " + boxes + "📦 dentro de la caja (?");
    return message.channel.send({ embeds: [embed] });
}

async function mini(dbuser) {
    await dbclient.addBox(dbuser._id, -1).catch((e) => { console.log; throw "NO_BOXES" });
    dbclient.transferCurrency(serafin._id, dbuser._id, _mini);

    let embed = new system.embed()
        .setColor(message.member.displayColor)
        .setDescription("<@" + message.author.id + "> recibiste " + _mini + system.currency);

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
        .setDescription("<@" + message.author.id + "> recibiste " + _normal + system.currency);

    return message.channel.send({ embeds: [embed] });
}
async function grande(dbuser) {
    await dbclient.addBox(dbuser._id, -1).catch((e) => { console.log; throw "NO_BOXES" });
    dbclient.transferCurrency(serafin._id, dbuser._id, _grande);

    let embed = new system.embed()
        .setColor(message.member.displayColor)
        .setDescription("<@" + message.author.id + "> recibiste " + _grande + system.currency);

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
        .setDescription("<@" + message.author.id + "> recibiste " + `${robpct * 100}%` + system.currency + ` de mis fondos (${amount + system.currency}) :3`);

    return message.channel.send({ embeds: [embed] });
}

async function pifia(dbuser) {
    await dbclient.addBox(dbuser._id, -1).catch((e) => { console.log; throw "NO_BOXES" });
    await dbclient.transferCurrency(dbuser._id, serafin._id, _mini);
    console.log("it went through")

    let embed = new system.embed()
        .setColor(message.member.displayColor)
        .setDescription("<@" + message.author.id + "> recibiste " + `-${_mini}` + system.currency + `! <:raoralaugh:1343492065954103336>`);

    console.log(embed, 'embed');
    return message.channel.send({ embeds: [embed] });
}

module.exports = command;