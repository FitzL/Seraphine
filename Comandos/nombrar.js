const { Command } = require("../modulos/MCommand.js");

prototype = {
  alias: ["name", "nombrar", "apodo"],
  descripcion: "Nickname another user",
  costo: 20,
  callback: async (args, message, client, system) => {
    let id = args[0];
    let target = message.mentions.members.first() || await system.findOneMember(id, message);

    if (!message.mentions.replieduser) args.shift();

    if (!target) {
      message.reply("Donno 'em fam.");
      throw "DEFERED";
    };

    if (!args) {
      return message.reply("What we calling them now bruv?");
      throw "DEFERED";
    };

    await target.setNickname(args.join(" ")).catch(async (err) => {
      await message.channel.send("Can't change their name's...");
      message.delete();
      throw err;
    })

    message.channel.send("Name changed 👻");

    message.delete();
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