const { Command } = require("../modulos/MCommand.js");
const { rol } = require('../modulos/Mrol.js');

prototype = {
    alias: ["reroll", "rehacer"], //nombre del comando
    descripcion: "", // que hace
    costo: 0,
    callback: async (args, message, client, sistema) => {
        if (sistema.ultimoPersonaje == 0) return message.reply("No se a que hacerle reroll pendejo");
        console.log(sistema.ultimoPersonaje);
        message.delete();
        return sistema.ultimoPersonaje.edit(rol(args[0]).toString())
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