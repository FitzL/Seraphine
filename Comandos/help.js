const { Command } = require("../modulos/MCommand.js");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, MessageFlags } = require('discord.js');

prototype = {
    alias: ["help", "h", "ayuda"], //nombre del comando
    descripcion: "muestra una descripción rapida de un comando", // que hace
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
                descripcion: c.descripcion || "Preguntale al dev",
                costo: c.costo
            });
            if (target) {
                if (c.alias.some(a => a === target.toLowerCase())) targetHelp = {
                    alias: c.alias,
                    descripcion: c.descripcion || "Preguntale al dev",
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
            .setFooter({ text: `Pagina ${page}/${maxPage}. Si, se que se ve horrible en movil, se joden.` })

        if (target) {
            box.setTitle("Acerca de: `" + target.toLowerCase() + "`")
            box.setDescription(targetHelp);
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

        let a = await message.reply({
            embeds: [box],
            components: [buttons]
        });

        const collector = a.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60_000 });

        collector.on('collect', i => {
            if (i.user.id == a.mentions.repliedUser.id) {
                if (i.customId == "-") {
                    if (page == 1) {
                        return i.reply({ content: `Ya estás en la primera página!`, flags: MessageFlags.Ephemeral });
                    }
                    page--;

                    let box = new system.embed()
                        .setTitle(system.prefix + "help <command>")
                        .setColor(client.member.displayColor)
                        .setDescription(
                            paginate(availableCommands, page, pagesize).join(" ")
                        )
                        .setFooter({text: `Pagina ${page}/${maxPage}`})

                    i.update({
                        embeds: [box]
                    });
                    return;
                }
            
                if (i.customId == "+") {
                    if (page == maxPage) return i.reply({ content: `Ya estás en la ultima página!`, flags: MessageFlags.Ephemeral });
                    page++;

                    let box = new system.embed()
                        .setTitle(system.prefix + "help <command>")
                        .setColor(client.member.displayColor)
                        .setDescription(
                            paginate(availableCommands, page, pagesize).join(" ")
                        )
                        .setFooter({text: `Pagina ${page}/${maxPage}`})

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
            console.log(a.author.id)
        });
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

function paginate(arr, page = 1, pagesize = 10) {
    page--;
    let start = page * pagesize;
    let end = start + pagesize;
    console.log(arr);

    return arr.slice(start, end);
}