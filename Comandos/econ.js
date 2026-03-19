const { Command } = require("../modulos/MCommand.js");

prototype = {
  alias: ["econ"], //nombre del comando
  descripcion: "Check your economic Status", // que hace
  costo: 5, //cuanto cuesta
  testing: false, //se está probando?
  callback: async (args, message, client, system) => {
    let users = await system.mongoclient.users.find({
      _id: {
        '$ne': client.user.id,
      },
      currency: {
        '$gt': 0,
      }
    }).sort({
      currency: -1,
    }).toArray();

    let total = 0;

    users.forEach((user, i) => {
      if (isNaN(user.currency)) return;
      total += user.currency;
    });

    let avg = ~~(total * 100 / users.length) / 100

    message.reply(
      `There's  ${total - 5 + system.currency} in circulation.\n` +
      `The average customer has ${avg}\n` +
      `You are ${avg < message.author.dbuser.currency ? "above" : "below"} average.\n` +
      `You hold ${~~(100 * ((message.author.dbuser.currency * 100) / total)) / 100}% of all ${system.currency}`
    )
  }
}

//seasdf

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
