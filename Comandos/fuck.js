const { Command } = require("../modulos/MCommand.js");

prototype = {
    alias: ["fuck"], //nombre del comando
    descripcion: "???", // que hace
    costo: 0, //cuanto cuesta
    testing: false, //se está probando?
    callback: async (args, message, client, system) => {
        await message.reply("Cochino <:emputao:1126997425626816632>");
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