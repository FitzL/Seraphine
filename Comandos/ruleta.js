const { Command } = require("../modulos/MCommand.js");

prototype = {
  alias: ["ruleta", "rr", "roulette"], //nombre del comando
  descripcion: "Check ping!", // que hace
  costo: 30, //cuanto cuesta
  testing: true, //se está probando?
  callback: async (args, message, client, system) => {
    let options = await message.channel.messages.fetch({ limit: 50 })

    let targets = [...new Map([...options].filter(x => x[1].member != null && !x[1].member.user.bot).map(x => [x[1].member.id, x[1].member])).values()]

    console.log(targets)

    let randomTarget = targets[~~(Math.random() * targets.length)];

    _message = await message.reply("La pistola está girando...");

    console.log(_message.id)

    setTimeout(async () => {
      _message = await _message.edit("Alguien saldrá herido...");
      console.log(_message.id)
    }, 1_000)


    setTimeout(async () => {
      try {
        await randomTarget.timeout(120_000, "ruleta")
        await _message.edit("<@" + randomTarget.id + "> ha sido eliminada/o (por 2 minutos).");
      } catch (e) {
        await _message.edit("Se me ha atascado la pistola... <:kyuserio:1317896754422616144>");
        system.mongoclient.transferCurrency(message.author.id, client.user.id, 50)
        message.channel.send("Me robo " + system.currency + "50 de <@" + randomTarget.id + ">")
        console.log(e)
      }
    }, 2_000)
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