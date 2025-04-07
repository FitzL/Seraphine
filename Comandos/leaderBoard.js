const { Command } = require("../modulos/MCommand.js");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, MessageFlags } = require('discord.js');

prototype = {
    alias: ["leaderboard", "lb", "top"], //nombre del comando
    descripcion: "Muestra los mas ricos del server", // que hace
    costo: 0, //cuanto cuesta
    testing: false, //se está probando?
    callback: async (args, message, client, system) => {
        lblEntries = [];
        let maxPage = 1;

        let page = 1;
        let pagesize = 10;

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

        users.forEach((user, i) => {
            lblEntries.push(
                `${i + 1}. \`${user.currency.toString().padStart(5, " ")}\`${system.currency} lvl: ${user.lvl.toString().padStart(2, " ")} <@${user._id}>`
            );
        });

        maxPage += ~~(lblEntries.length / pagesize);
        if (lblEntries.length % pagesize == 0) maxPage--;

        let embed = new system.embed()
            .setColor(client.member.displayColor)
            .setTitle("El top de panaderos.")
            .setFooter({ text: `Pagina ${page}/${maxPage}` })

        embed.setDescription(paginate(lblEntries, page, pagesize).join("\n"));


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
            embeds: [embed],
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
                        .setTitle("El top de panaderos.")
                        .setColor(client.member.displayColor)
                        .setDescription(
                            paginate(lblEntries, page, pagesize).join("\n")
                        )
                        .setFooter({ text: `Pagina ${page}/${maxPage}` })

                    i.update({
                        embeds: [box]
                    });
                    return;
                }

                if (i.customId == "+") {
                    if (page == maxPage) return i.reply({ content: `Ya estás en la ultima página!`, flags: MessageFlags.Ephemeral });
                    page++;

                    let box = new system.embed()
                        .setTitle("El top de panaderos.")
                        .setColor(client.member.displayColor)
                        .setDescription(
                            paginate(lblEntries, page, pagesize).join("\n")
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
            console.log(a.author.id)
        });
    }
};

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

    return arr.slice(start, end);
}