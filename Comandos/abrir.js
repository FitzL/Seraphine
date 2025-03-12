var dbclient;

module.exports = {
    alias: ["abrir"], //nombre del comando
    descripcion: "", // que hace
    costo: 0, //cuanto cuesta
    testing: true, //se está probando?
    callback: async (args, message, client, system) => {
        if (message.author.dbuser.cajas < 1) return message.reply("No tenés cajas, 'ché")

        dbclient = system.mongoclient;
        let rndnumber = ~~(Math.random() * 100_000) / 1_000;
        let prize = "";

        console.log(loottable, rndnumber)

        Object.entries(loottable).forEach(([key, value]) => {
            if (rndnumber >= value[1]) {
                prize = key;
            }
        })

        switch (prize) {
            case 'caja':
                caja(message.author.dbuser)
                    .catch((e) => { console.log; return});
                break;
            case 'mini':
                mini(message.author.dbuser)
                    .catch((e) => {console.log; return});
                break;
            case 'mini_troll':
                mini_troll(message.author.dbuser)
                    .catch((e) => {console.log; return});
                break;
            case 'normal':
                normal(message.author.dbuser)
                    .catch((e) => {console.log; return});
                break;
            case 'grande':
                grande(message.author.dbuser)
                    .catch((e) => {console.log; return});
                break;
            case 'rob':
                rob(message.author.dbuser)
                    .catch((e) => {console.log; return});
                break;
        }
    }
}

const lt_A = {
	caja: 15_0,
    mini: 45_0,
    mini_troll: 45_0,
    normal: 90_0,
    grande: 10_0,
    rob: 5,
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
    return obj;
}

async function caja(dbuser) {
    await dbclient.addBox(dbuser._id, -1).catch((e) => { console.log; throw "NO_BOXES" });
    return;
}
async function mini(dbuser) {
    await dbclient.addBox(dbuser._id, -1).catch((e) => { console.log; throw "NO_BOXES" });
    return;
}
async function mini_troll(dbuser) {
    await dbclient.addBox(dbuser._id, -1).catch((e) => { console.log; throw "NO_BOXES" });
    return;
}
async function normal(dbuser) {
    await dbclient.addBox(dbuser._id, -1).catch((e) => { console.log; throw "NO_BOXES" });
    return;
}
async function grande(dbuser) {
    await dbclient.addBox(dbuser._id, -1).catch((e) => { console.log; throw "NO_BOXES" });
    return;
}
async function rob(dbuser) {
    await dbclient.addBox(dbuser._id, -1).catch((e) => { console.log; throw "NO_BOXES" });
    return;
}
