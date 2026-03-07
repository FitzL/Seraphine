const { Command } = require("../modulos/MCommand.js");
const { mongoClient, Timer } = require('../db/db.js');

prototype = {
  alias: ["remind", "setreminder", "reminder", "recuerdame", "recuerda"], //nombre del comando
  descripcion: "set a reeminder", // que hace
  costo: 5, //cuanto cuesta
  testing: false, //se está probando?
  callback: async (args, message, client, system) => {
    let timeregex = /(\d+)\s*(h|m|s)/gi;
    let time = args.shift(1);

    let totaltime = 0;

    for (let match of time.matchAll(timeregex)) {
      console.log(match)
      if (isNaN(match[1])) continue;
      switch (match[2]) {
        case "h":
          totaltime += match[1] * 60 * 60;
          break;
        case "m":
          totaltime += match[1] * 60;
          break;
        case "s":
          totaltime += match[1] * 1;
          break;
        default:
          totaltime += match[1] * 60;
          break;
      }
    }

    console.log(totaltime);

    let _message = args.join(" ");
    let timer = new Timer(
      message.author.id,
      message.channel.id,
      totaltime,
      _message
    )

    await mongoClient.insertTimer(timer);

    message.reply("Timer set, I will ping you on this channel. :3")

  }
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