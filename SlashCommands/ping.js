const { Command } = require("../modulos/MCommand.js");

command =  {
    alias: ["ping"], //nombre del comando
    descripcion: "Check your ping", // que hace
    costo: 0, //cuanto cuesta
    testing: false, //se está probando?
    callback: async (args, message, client, system) => {
        await message.reply("Pong!").then(async (_message) => {
            await _message.edit("Pong! " +
                "\n-# ping: " + (Date.now() - message.createdTimestamp).toString() + "ms"
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