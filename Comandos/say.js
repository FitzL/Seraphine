const { Command } = require("../modulos/MCommand.js");

prototype = {
    alias: ["say"], //nombre del comando
    descripcion: "", // que hace
    costo: 0, //cuanto cuesta
    testing: true, //se está probando?
    callback: async (args, message, client, system) => {
        let channel = await message.guild.channels.fetch(args[0]).catch((e) => { console.log }) || message.mentions.channels.first();
        if (channel == undefined) channel = message.channel;
        else args.shift();

        let content = addEveryone(args.join(" "));

        channel.send(content);
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

function addEveryone(str) {
    str = str.replace("[everyjuan]", "@everyone");
    str = str.replace("[everyone]", "@everyone");
    str = str.replace("[here]", "@here");
    return str;
}

module.exports = command;