const { Command } = require("../modulos/MCommand.js");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, MessageFlags } = require('discord.js');

prototype = { //
    alias: ["choose"],
    help: "Elige una de varias opciones",
    testing: false,
    callback: async (args, message, client, system) => {
        let options = args.join(" ").split(/,/g).filter(w => w.length > 0);
        if (options.length < 2) options = args;
        let resultado = options[~~(Math.random() * options.length)];

        const test = new system.embed()
            .setColor(client.member.displayColor)
            .setTitle("Elijo...")
            .setDescription(resultado)

        const denuevo = new ButtonBuilder()
            .setCustomId('again')
            .setLabel('Otra vez!')
            .setStyle(ButtonStyle);

        const buttons = new ActionRowBuilder()
            .addComponents(denuevo);

        let a = await message.reply({
            embeds: [test],
            components: [buttons]
        });


        const collector = a.createMessageComponentCollector({ componentType: ComponentType.Button, time: 30_000 });

        collector.on('collect', i => {
            if (i.user.id == a.mentions.repliedUser.id) {
                if (i.customId == "again") {
                    let resultado = options[~~(Math.random() * options.length)];

                    const test = new system.embed()
                        .setColor(client.member.displayColor)
                        .setTitle("Elijo...")
                        .setDescription(resultado);

                    i.update({
                        embeds: [test]
                    })
                }
            }
        });

        collector.on('end', collected => {
            a.edit({
                components: []
            })
        })
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