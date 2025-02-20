const { rol } = require('../modulos/Mrol.js');

module.exports = {
    alias: ["reroll", "rehacer"], //nombre del comando
    descripcion: "", // que hace
    callback: async (args, message, client, sistema) => {
        if (sistema.ultimoPersonaje == 0) return message.reply("No se a que hacerle reroll pendejo");
        return sistema.ultimoPersonaje.edit(rol(args[0]))
    }
}