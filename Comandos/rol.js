const { rol } = require('../modulos/Mrol.js');
const { Command } = require("../modulos/MCommand.js");

prototype = {
    alias: ["rol", "roll", "character"], //nombre del comando
    descripcion: "", // que hace
    costo: 1,
    callback: async (args, message, client, sistema) => {
        let personaje = rol(args[0]);
        message.reply(personaje).then(m => { sistema.ultimoPersonaje = m });
        console.log(sistema.ultimoPersonaje)
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
