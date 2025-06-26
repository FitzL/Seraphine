const { Command } = require("../modulos/MCommand.js");

prototype = {
    alias: ["filter"], //nombre del comando
    descripcion: "", // que hace
    costo: 0, //cuanto cuesta
    testing: false, //se está probando?
    callback: async (args, message, client, system) => {
        let i = 5
        let lastid = undefined;
        while (i--) {
            message.channel.messages.fetch({ limit: 100, after: lastid })
                .then(messages => {
                    console.log(lastid)
                    lastid = messages.last().id;
                    console.log(`${messages.filter(message => message.author.id === '702283061298987089').size} messages`)
                })
                .catch(console.error);
        }
    },
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