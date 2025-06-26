const { Command } = require("../modulos/MCommand.js");

prototype = {
    alias: ["premio", "reward", "givebox", "regalar", "gift", "buy"], //nombre del comando
    descripcion: "", // que hace
    costo: 0, //cuanto cuesta
    testing: false, //se está probando?
    callback: async (args, message, client, system) => {
        var costo = 55;
        let error = false;
        notamount = 1;

        let amount = args[0] || 1;
        if (isNaN(parseInt(amount))) { amount = args[1]; notamount-- };
        if (!amount || isNaN(amount)) amount = 1;
        costo *= ~~amount;
        console.log(costo);

        if (costo > message.author.dbuser.currency) return message.reply("Pobre");

        let target = message.mentions.users.first() || await system.findOneMember(args[notamount], message);

        target = !target ? message.member : target;

        if (!target) {
            await message.reply("Y a quien se lo mando?");
            throw "err";
        }

        target = await system.mongoclient.findUser(target.id).catch((e) => console.log);

        if (target._id == message.author.id) {
            await message.channel.send("<:raoralaugh:1343492065954103336>");

            costo += ~~(costo * .19)
        }

        if (costo > message.author.dbuser.currency) return message.reply("Pobre");

        console.log("there is this many boxes: ", amount)

        if (amount == null) {
            return message.reply("Cuantas cajas querés mandar?")
        }

        await system.mongoclient.addBox(target._id, amount).catch((e) => {
            console.log;
            error = true;
        }).then(async () => {
            let embed = new system.embed()
                .setColor(client.member.displayColor)
                .setDescription("-" + costo + system.currency)

            await system.mongoclient.transferCurrency(message.author.id, client.user.id, costo); //taxes
            message.channel.send({ embeds: [embed] });
        });

        if (error) throw "err";
        let embed = new system.embed()
            .setColor(message.member.displayColor)
            .setDescription("<@" + target._id + "> ha recibido " + amount + ` caja${amount > 1 ? "s": ""} <:peek:1306437352192872559>` + `\n-# por parte de <@` + message.author.id + `>`)

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