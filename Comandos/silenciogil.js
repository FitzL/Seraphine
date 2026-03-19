const { Command } = require("../modulos/MCommand.js");

prototype = {
  alias: ["silenciogil", "silencio", "calla", "mute", "shut", "shutup", "shush"], //nombre del comando
  descripcion: "Silencio Gil", // que hace
  costo: 30, //cuanto cuesta
  testing: false, //se está probando?
  callback: async (args, message, client, system) => {
    let id = args.shift();

    // try to catch the first user mention in message
    let target = message.mentions.members.first() || await system.findOneMember(id, message);
    troll = Math.random() < 0.075;

    if (!target) {
      message.reply("Idk that guy");
      throw "user not found";
    };

    if (target.id == client.user.id) {
      message.reply("That's me bruv");
      throw "PIFIA";
      return;
    }

    if (troll) {
      target = message.member;
      await target.timeout(15_000, 'kyc').catch(async (err) => {
        await message.channel.send("no?");
        //message.delete();
        throw err;
      })

      await message.channel.send("<@" + target.id + "> used `shush`, but it backfired...");

      //message.delete();
      return;
    }

    await target.timeout(30_000, 'kyc').catch(async (err) => {
      await message.channel.send("I can't silence them");
      //message.delete();
      throw err;
    })

    await message.channel.send("Shut up <@" + target.id + ">");

    //message.delete();
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
