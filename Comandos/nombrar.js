const { Command } = require("../modulos/MCommand.js");

prototype = {
    alias: ["name", "nombrar", "apodo"],
    descripcion: "Cambia el nickname de otro usuario.",
    costo: 20,
    callback: async (args, message, client, system) => {
        let id = args[0];
        let target = message.mentions.members.first() || await system.findOneMember(id, message);

        if (!message.mentions.replieduser) args.shift();

        if (!target) {
            message.reply("Ni idea de quien hablas.");
            throw "user not found";
        };
        if (!args) {
            return message.reply("Como chucha le pongo?");
            throw "not valid args";
        };

        await target.setNickname(args.join(" ")).catch(async (err) => {
            await message.channel.send("No pude cambiarle el nombre...");
            message.delete();
            throw err;
        })

        await message.channel.send("Nombre cambiado 👻");

        message.delete();
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