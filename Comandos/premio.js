const { Command } = require("../modulos/MCommand.js");

prototype = {
    alias: ["premio", "reward", "givebox", "regalar", "gift"], //nombre del comando
    descripcion: "", // que hace
    costo: 55, //cuanto cuesta
    testing: true, //se está probando?
    callback: async (args, message, client, system) => {
        console.log(this.costo)
        let error = false;
        notamount = 1;

        let amount = args[0];
        if (isNaN(parseInt(amount))) { amount = args[1]; notamount-- };
        this.costo *= ~~amount;
        if (this.costo > message.author.dbuser.currency) return message.reply("Pobre");

        let target = message.mentions.users.first() || await system.findOneMember(args[notamount]);

        if (!target) {
            await message.reply("Y a quien se lo mando?");
            throw "err";
        }

        target = await system.mongoclient.findUser(target.id).catch((e) => console.log);


        if (target._id == message.author.id) {
            await message.reply("'Che, a vos mism@?\nQue patético.");
            await message.channel.send("<:raoralaugh:1343492065954103336>");
            throw "PIFIA";
        }

        console.log(amount);

        if (!amount || isNaN(amount)) amount = null;

        await system.mongoclient.addBox(target._id, amount).catch((e) => {
            console.log;
            error = true;
        }).then(() => {
            console.log(amount);
            if (amount != null) {
                throw "CHECK_PRIZE_AGAIN";
            }
        });

        if (error) throw "err";
        let embed = new system.embed()
            .setColor(message.member.displayColor)
            .setDescription("<@" + target._id + "> ha recibido una caja <:peek:1306437352192872559>" + `\n-# por parte de <@` + message.author.id + `>`)

        message.channel.send({ embeds: [embed] });
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

module.exports = command;