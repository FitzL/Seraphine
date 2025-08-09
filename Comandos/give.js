const { Command } = require("../modulos/MCommand.js"); 
prototype = {
    alias: ["give", "transfer", "dar"], //nombre del comando
    descripcion: "Transfiere dinero", // que hace
    costo: 0, //cuanto cuesta
    callback: async (args, message, client, system) => {
        let dbuser = message.author.dbuser;
        let exit = false
        notamount = 1;

        let amount = args[0];
        if (isNaN(parseInt(amount))) { amount = args[1]; notamount-- };
            if (amount > dbuser.currency) return message.reply("Pobre");

        let target = message.mentions.users.first() || await system.findOneMember(args[notamount], message);
            if (!target) return message.reply("Y a quien se lo mando?");
        target = await system.mongoclient.findUser(target.id);
            
        await system.mongoclient.transferCurrency(dbuser._id, target._id, amount).catch((e) => {
            console.log;
            exit = true;
            switch (e) {
                case "A_AND_B_ARE_EQUAL":
                    return message.reply("'tas pendejo?");
                    break;
                case "NEGATIVE":
                    return message.reply("?");
                    break;
                case "NAN":
                    return message.reply("'Che, cuanto le querés mandar?");
                    break;
                default:
                    break;
            }
        });

        if (exit) return;
		let embed = new system.embed()
			.setColor(message.member.displayColor)
			.setDescription("Has transferido " + ~~amount + "" + system.currency + " a <@" + target._id + ">!");

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