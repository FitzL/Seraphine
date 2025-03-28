const { Command } = require("../modulos/MCommand.js");

prototype = {
    alias: ["lockdown", "ld"], //nombre del comando
    descripcion: "", // que hace
    costo: 0, //cuanto cuesta
    testing: true, //se está probando?
    callback: async (args, message, client, system) => {
        system.mongoclient.updateUser(client.user.id, "lockdown", !system.lockdown);
        system.lockdown = !system.lockdown;
        message.reply(system.lockdown ? "Se han bloqueado las actualizaciones de usuario y comandos." : "Se han desbloqueado las actualizaciones de usuario y comandos.")
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