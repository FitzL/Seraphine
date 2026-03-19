const { Command } = require("../modulos/MCommand.js");
const { dbUser, mongoClient, Timer, Effect } = require('../db/db.js');

prototype = {
  alias: ["tomato", "tomate", "boo"], //nombre del comando
  descripcion: "*throw a tomato at someone*", // que hace
  help: "Miku will personally throw tomatoes at your enemies",
  costo: 30, //cuanto cuesta
  testing: false, //se está probando?
  callback: async (args, message, client, system) => {
    let id = args.shift();
    let target = message.mentions.users.first() || await system.findOneMember(id, message);
    let channel = message.channel;

    if (!target) {
      message.reply("Who's that?");
      throw "USER_NOT_FOUND";
    };

    dbTarget = await mongoClient.findUser(target.id);
    let effects = await dbTarget.getEffects();

    if (effects.length > 0) {
      message.reply("They are already getting tomatoes :>");
      throw "DEFERED";
    }


    mongoClient.insertEffect(new Effect(target.id, "🍅", 600, Date.now()))

    channel.send("<@" + target.id + "> :tomato:!");
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