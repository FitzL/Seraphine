const { Command } = require("../modulos/MCommand.js");

prototype = {
  alias: ["link", "lonk"], //nombre del comando
  descripcion: "Link lichess account to your profile", // que hace
  costo: 0, //cuanto cuesta
  testing: false, //se está probando?
  callback: async (args, message, client, system) => {
    if (args[0] === undefined) return message.reply("What's your account bruv");
    system.mongoclient.updateUser(message.author.id, "lichess", args[0])
    system.mongoclient.updateUser(message.author.id, "isLichessVerified", false);

    message.reply(args[0] + " is now your lichess account. Feel free to verify it.");
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