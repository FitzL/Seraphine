const { rol } = require('../modulos/Mrol.js');

module.exports = {
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