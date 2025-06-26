const { Command } = require("../modulos/MCommand.js");

command =  {
    alias: ["ping"], //nombre del comando
    descripcion: "", // que hace
    costo: 0, //cuanto cuesta
    testing: false, //se está probando?
    callback: async (args, message, client, system) => {
        await message.reply("Pong!").then(async (_message) => {
            await _message.edit("Pong! " +
                "\n-# ping: " + (_message.createdTimestamp - message.createdTimestamp).toString()
            );
        });

    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName(command.alias[0])
        .setDescription(command.descripcion),
    async execute(interaction) {
        await command.callback(args, interaction, client, system)
    }
};