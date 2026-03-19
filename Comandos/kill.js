const { Command } = require("../modulos/MCommand.js");

prototype = {
  alias: ["kill"], //nombre del comando
  descripcion: "Bot reset", // que hace
  costo: 1, //cuanto cuesta
  testing: false, //se está probando?
  callback: async (args, message, client, system) => {
    if (message.author.id != "443966554078707723") throw "not_owner";
    await message.reply("_AGHHHHHHHHH_ \n-# dies cutely");
    setTimeout(async () => {
      await process.kill(0);
    }, 1_000)

    return;
  },
  init: async (args, message, client, system) => {
    await message.reply("_AGHHHHHHHHH_ \n-# dies cutely");
    setTimeout(async () => {
      await process.kill(0);
    }, 1_000)
    if (message.author.id == "443966554078707723") throw "owner";

    return;
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