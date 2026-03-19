const { Command } = require("../modulos/MCommand.js");

prototype = {
  alias: ["premio", "reward", "givebox", "regalar", "gift", "buy"], //nombre del comando
  descripcion: "Buy boxes, for yourself or a friend.", // que hace
  costo: 0, //cuanto cuesta
  testing: false, //se está probando?
  callback: async (args, message, client, system) => {
    var costo = 60;
    let error = false;
    notamount = 1;

    let amount = args[0] || 1;
    if (isNaN(parseInt(amount))) { amount = args[1]; notamount = 0 };
    if (!amount || isNaN(amount)) amount = 1;
    costo *= ~~amount;
    console.log(costo);

    if (costo > message.author.dbuser.currency) return message.reply("Pobre");

    let target = message.mentions.users.first() || await system.findOneMember(args[notamount], message) || message.member;

    target = await system.mongoclient.findUser(target.id).catch((e) => console.log);
    if (!target) return message.reply("Who do you want to gift a box to?");

    if (target._id == message.author.id) {
      await message.channel.send("<:raoralaugh:1343492065954103336>")
    }

    if (costo > message.author.dbuser.currency) return message.reply("Broke ahh");

    console.log("there is this many boxes: ", amount)

    if (amount == null) {
      return message.reply("How many boxes??")
    }

    await system.mongoclient.addBox(target._id, amount).catch((e) => {
      console.log;
      error = true;
    }).then(async () => {
      let embed = new system.embed()
        .setColor(client.member.displayColor)
        .setDescription("-" + costo + system.currency)

      await system.mongoclient.transferCurrency(message.author.id, client.user.id, costo); //taxes
      message.channel.send({ embeds: [embed] });
    });

    if (error) throw "err";
    let embed = new system.embed()
      .setColor(message.member.displayColor)
      .setDescription("<@" + target._id + "> ha recibido " + amount + ` caja${amount > 1 ? "s" : ""} <:peek:1306437352192872559>` + `\n-# por parte de <@` + message.author.id + `>`)

    message.channel.send({ embeds: [embed] });


    let logEmbed = new system.embed()
      .setColor(client.member.displayColor)
      .setDescription(
        costo + system.currency +
        `\n<@${message.author.id}> usó \`buy\``
      )

    await system.logChannel.send({
      embeds: [logEmbed]
    })

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