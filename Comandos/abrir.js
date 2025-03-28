var dbclient;
var message;
var system;

const _mini = 50;
const _normal = 75;
const _grande = 150;
const robpct = 0.25;

const { Command } = require("../modulos/MCommand.js");

prototype = {
    alias: ["abrir", "box", "open", "caja", "ouvrir"], //nombre del comando
    descripcion: "Abre cajas pues", // que hace
    costo: 0, //cuanto cuesta
    testing: true, //se está probando?
    callback: async (args, _message, client, _system) => {
        system = _system;
        if (_message.author.dbuser.cajas < 1) {
            message.reply("No tenés cajas, 'ché");
            return;    
        }

        dbclient = system.mongoclient;
        message = _message;

        let rndnumber = ~~(Math.random() * 100_000) / 1_000;
        let prize = "";

        Object.entries(loottable).forEach(([key, value]) => {
            if (rndnumber >= value[1]) {
                prize = key;
            }
        })

        switch (prize) {
            case 'caja':
                await caja(message.author.dbuser)
                    .catch((e) => { console.log; return});
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
    caja: 20_00,
    pifia: 20_00,
    mini: 65_00,
    mini_troll: 10_00,
    normal: 35_00,
    grande: 10_00,
    rob: 15,
}

let loottable = ProbabilityFromObject(lt_A);
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

async function caja(dbuser) {
    await dbclient.addBox(dbuser._id, -1).catch((e) => { console.log; throw "NO_BOXES" });

    let boxes = ~~(Math.random() * 3) + 1;
    dbclient.addBox(dbuser._id, boxes);

    message.reply("Habían " + boxes + "📦 dentro de la caja (?");
    return;
}
async function mini(dbuser) {
    await dbclient.addBox(dbuser._id, -1).catch((e) => { console.log; throw "NO_BOXES" });
    dbclient.addCurrency(dbuser._id, _mini);

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
    dbclient.addCurrency(dbuser._id, _normal);

    let embed = new system.embed()
        .setColor(message.member.displayColor)
        .setDescription("<@" + message.author.id + "> recibiste " + _normal + system.currency);

    return message.channel.send({ embeds: [embed] });
}
async function grande(dbuser) {
    await dbclient.addBox(dbuser._id, -1).catch((e) => { console.log; throw "NO_BOXES" });
    dbclient.addCurrency(dbuser._id, _grande);

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
    dbclient.addCurrency(dbuser._id, ~(normal));

    let embed = new system.embed()
        .setColor(message.member.displayColor)
        .setDescription("<@" + message.author.id + "> recibiste " + `-${normal}%` + system.currency `! <:raoralaugh:1343492065954103336>`);

    return message.channel.send({ embeds: [embed] });
}

module.exports = command;