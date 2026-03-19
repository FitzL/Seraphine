const { Command } = require("../modulos/MCommand.js");

prototype = {
  alias: ["imitar", "copy"], //can have multiple but would recommend keeping it under two
  descripcion: "Miku impersonates someone for you", //shouldn't exceed two lines.
  help: "Sends a decoy that disguises as someone with a personalised message.",
  costo: 15,
  test: true,
  callback: async (args, message, client, system) => {
    let id = args[0];
    let target = message.mentions.members.first() || await system.findOneMember(id, args[0]);
    console.log(target);

    if (!message.mentions.replieduser) args.shift();

    if (!target) {
      message.reply("Idk who to copy");
      throw "error";
    }
    if (!args[0]) {
      message.reply("What am I supposed to say fam");
      throw "error";
    }

    let webhookUsername = target.displayName || target.username;
    let pfp = target.user.avatarURL().toString();

    const webhook = await message.channel.createWebhook({
      name: webhookUsername,
      avatar: pfp,
    })
    await webhook.send(args.join(" "));
    await webhook.delete();
    message.delete();
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