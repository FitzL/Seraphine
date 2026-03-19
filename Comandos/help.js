const { Command } = require("../modulos/MCommand.js");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, MessageFlags } = require('discord.js');

prototype = {
  alias: ["help", "h", "ayuda", "commands"], //nombre del comando
  descripcion: "Should show you important info about commands", // que hace
  help: "Get descriptions of a command or commands and see their other aliases",
  costo: 0, //cuanto cuesta
  testing: false, //se está probando?
  callback: async (args, message, client, system) => {
    let target = args.shift();
    let targetHelp;
    let help = [];
    let availableCommands = [];
    let maxLength = 0;
    let maxPage = 1;

    let page = 1;
    let pagesize = 10;

    await system.commands.forEach(c => {
      if (c.alias[0].length > maxLength) maxLength = c.alias[0].length
      help.push({
        alias: c.alias,
        descripcion: c.descripcion || "Ask the dev",
        costo: c.costo
      });


      if (target) {
        if (c.alias.some(a => a === target.toLowerCase())) targetHelp = {
          alias: c.alias,
          descripcion: c.descripcion || "Ask the dev",
          help: c.help || c.descripcion || "Ask the dev",
          costo: c.costo
        };
      }
    });

    maxLength += 3;
    await help.forEach(h => {
      let handle = [
        "`",
        ("[" + h.alias[0] + "]").toString().padEnd(maxLength, " "),
        "`",
        "`",
        (h.costo).toString().padStart(3, " "),
        "`",
        system.currency,
        h.descripcion
      ].join(" ") + "\n";
      availableCommands.push(handle)
    })

    //message.reply(availableCommands.join("\n"))
    //return;

    maxPage += ~~(availableCommands.length / pagesize)
    if (availableCommands % pagesize == 0) maxPage--
    console.log(maxPage);

    let box = new system.embed()
      .setTitle(system.prefix + "help <command>")
      .setColor(client.member.displayColor)
      .setDescription(
        paginate(availableCommands, page, pagesize).join(" ")
      )
      .setFooter({ text: `Page ${page}/${maxPage}.` })

    if (target) {
      box.setTitle("About: `" + target.toLowerCase() + "`")
      box.setDescription(
        "Aliases: `" + targetHelp.alias.join("`, `") + "`\n" +
        targetHelp.help);
      box.setFooter({ text: null })
    };


    //botones
    const previous = new ButtonBuilder()
      .setCustomId('-')
      .setLabel('<')
      .setStyle(ButtonStyle.Primary);

    const next = new ButtonBuilder()
      .setCustomId('+')
      .setLabel('>')
      .setStyle(ButtonStyle.Primary);

    const buttons = new ActionRowBuilder()
      .addComponents(previous, next);



    if (target) {
      return await message.reply({
        embeds: [box]
      });
    };

    let a = await message.reply({
      embeds: [box],
      components: [buttons]
    });

    const collector = a.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60_000 });

    collector.on('collect', i => {
      collector.resetTimer()
      if (i.user.id == a.mentions.repliedUser.id) {
        if (i.customId == "-") {
          if (page == 1) {
            return i.reply({ content: `First Page!`, flags: MessageFlags.Ephemeral });
          }
          page--;

          let box = new system.embed()
            .setTitle(system.prefix + "help <command>")
            .setColor(client.member.displayColor)
            .setDescription(
              paginate(availableCommands, page, pagesize).join(" ")
            )
            .setFooter({ text: `Page ${page}/${maxPage}.` })

          i.update({
            embeds: [box]
          });
          return;
        }

        if (i.customId == "+") {
          if (page == maxPage) return i.reply({ content: `Last Page!`, flags: MessageFlags.Ephemeral });
          page++;

          let box = new system.embed()
            .setTitle(system.prefix + "help <command>")
            .setColor(client.member.displayColor)
            .setDescription(
              paginate(availableCommands, page, pagesize).join(" ")
            )
            .setFooter({ text: `Pagina ${page}/${maxPage}` })

          i.update({
            embeds: [box]
          });
          return;
        }
      } else {
        i.reply({ content: `These buttons aren't for you!`, flags: MessageFlags.Ephemeral });
      }
    });

    collector.on('end', collected => {
      a.edit({
        components: []
      })
    });
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

function paginate(arr, page = 1, pagesize = 10) {
  page--;
  let start = page * pagesize;
  let end = start + pagesize;
  console.log(arr);

  return arr.slice(start, end);
}