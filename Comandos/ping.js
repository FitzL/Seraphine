const { Command } = require("../modulos/MCommand.js");

prototype = {
  alias: ["ping"], //nombre del comando
  descripcion: "Check ping!", // que hace
  costo: 0, //cuanto cuesta
  testing: false, //se está probando?
  callback: async (args, message, client, system) => {
    await message.reply("Pong!").then(async (_message) => {
      await _message.edit("Pong! " +
        "\n-# ping: " + (Date.now() - message.createdTimestamp).toString() + "ms"
      );
    });

  },
  init: async (args, message, client, system) => {
    console.log(this);
    console.log("hellow world")
    return args;
  }
}

let command = new Command(
  prototype.alias,
  prototype.descripcion,
  prototype.help,
  prototype.costo,
  prototype.testing,
  prototype.callback,
  prototype.init
)

module.exports = command;