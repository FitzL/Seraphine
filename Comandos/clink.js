const { Command } = require("../modulos/MCommand.js");

prototype = {
  alias: ["clink", "linkc", "cl"], //nombre del comando
  descripcion: "Link chesscom account to your profile", // que hace
  costo: 0, //cuanto cuesta
  testing: false, //se está probando?
  callback: async (args, message, client, system) => {
    if (args[0] === undefined) return message.reply("What's your account bruv");
    system.mongoclient.updateUser(message.author.id, "chesscom", args[0])
    system.mongoclient.updateUser(message.author.id, "isChesscomVerified", false);

    message.reply(args[0] + " is now your chesscom account. Feel free to verify it.");
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