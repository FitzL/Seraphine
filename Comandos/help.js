const { Command } = require("../modulos/MCommand.js");
prototype = {
    alias: ["help"], //nombre del comando
    descripcion: "muestra una descripción rapida de un comando", // que hace
    costo: 0, //cuanto cuesta
    testing: false, //se está probando?
    callback: async (args, message, client, system) => {
        let target = args.shift();
        let targetHelp;
        let help = [];
        let availableCommands = [];

        system.commands.filter(c => c.descripcion).forEach(c => {
            if (c.testing) return;
            help.push([c.alias, c.descripcion, c.costo]);
            if (target) {
                if (c.alias.some(a => a === target.toLowerCase())) targetHelp = c.descripcion;
            }
        });

        help.forEach(h => {
            let handle = "`" + h[0][0] + "`" + h[2] + system.currency + "\n";
            if (h[2] == 0 || !h[2]) handle = " `" + h[0][0] + "`" + "(gratis)" + system.currency + "\n";
            availableCommands.push(handle)
        })

        let box = new system.embed()
            .setTitle(system.prefix + "help <command>")
            .setColor(client.member.displayColor)
            .setDescription(
                "Te puedo brindar información extra acerca de: \n* " +
                availableCommands.join("* ")
            )

        if (target) {
            box.setTitle("Acerca de: `" + target.toLowerCase() + "`")
            box.setDescription(targetHelp);
        };

        message.reply({ embeds: [box] });
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