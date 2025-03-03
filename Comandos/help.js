module.exports = {
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
            help.push([c.alias, c.descripcion]);
            if (target) {
                if (c.alias.some(a => a === target.toLowerCase())) targetHelp = c.descripcion;
            }
        });

        help.forEach(h => { availableCommands.push("`" + h[0].join("/") + "`\n") })

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
