const { Command } = require("../modulos/MCommand.js");

command = {
  alias: ["ping"], //nombre del comando
  descripcion: "Check your ping", // que hace
  costo: 0, //cuanto cuesta
  testing: false, //se está probando?
  expectedArgs: [{
    "string": "text"
  }],
  callback: async (args, message, client, system) => {

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