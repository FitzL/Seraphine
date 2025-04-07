const { Command } = require("../modulos/MCommand.js");

prototype = {
    alias: ["boop"], //nombre del comando
    descripcion: "*boop*", // que hace
    costo: 1, //cuanto cuesta
    testing: false, //se está probando?
    callback: async (args, message, client, system) => {
        let id = args.shift();
        let target = message.mentions.users.first() || await system.findOneMember(id, message);

        if (!target) {
            message.reply("Ni idea de quien hablas.");
            throw "user not found";
        };

        await message.channel.send("_boop_ <@" + target.id + ">");
        message.delete();
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