const { Command } = require("../modulos/MCommand.js");

prototype = { //
    alias: ["choose", "dado"],
    help: "Lanza una moneda, o un dado",
    callback: async (args, message, client, system) => {
        let _default = ["cara", "cruz"];
        let resultado = 1;



        if (!args[0] || args[0] <= 2) {
            resultado = Math.random() > 0.5 ? _default[0] : _default[1];
        } else if (isNaN(args[0])) {
            resultado = args[~~(Math.random() * args.length)];
        } else {
            resultado += ~~(Math.random() * args[0]);
        }

        const test = new system.embed()
            .setColor(client.member.displayColor)
            .setTitle("Elijo...")
            .setDescription("" + resultado)

        message.reply({ embeds: [test] });
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