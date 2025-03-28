const { Command } = require("../modulos/MCommand.js");

prototype = {
    alias: ["lb", "top", "leaderboard"], //nombre del comando
    descripcion: "", // que hace
    costo: 0, //cuanto cuesta
    testing: false, //se está probando?
    callback: async (args, message, client, system) => {
        let n = 10;
        let lbEntries = [];

        if (args[0]) n = Math.max(Math.min(args[0], 12), 0)

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

        let embed = new system.embed()
            .setColor(client.member.displayColor)
            .setTitle("El top " + n + " de panaderos.")

        let top = users.slice(0, n);

        top.forEach((user, i) => {
            lbEntries.push(
                `${i + 1}. \`${user.currency.toString().padStart(4, " ") }\`${system.currency} lvl: ${user.lvl.toString().padStart(2, " ")} <@${user._id}>`
            );
        });

        embed.setDescription(lbEntries.join("\n"));
        message.reply({ embeds: [embed] });
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