const { rol } = require('../modulos/Mrol.js');
const { Command } = require("../modulos/MCommand.js");

prototype = {
    alias: ["character"], //nombre del comando
    descripcion: "", // que hace
    costo: 1,
    callback: async (args, message, client, sistema) => {
        let personaje = rol(args[0]);
        await message.reply(personaje.toString()).then(m => { sistema.ultimoPersonaje = m });
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
