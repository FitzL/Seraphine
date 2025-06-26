const { Command } = require("../modulos/MCommand.js");

prototype = {
    alias: ["pfp", "avatar", "fdp"], //nombre del comando
    descripcion: "Muestra el perfil", // que hace
    costo: 0, //cuanto cuesta
    callback: async (args, message, client, system) => {
        let user = message.author.dbuser;
        let discorduser = message.member;

        let target = message.mentions.members.first() || await system.findOneMember(args[0], message);

        if (target) discorduser = target;

        let embed = new system.embed()
            .setColor(discorduser.displayColor)
            .setTitle(discorduser.displayName)
            .setImage(discorduser.user.displayAvatarURL({ size: 1024, extension: "png" }));
        message.channel.send({ embeds: [embed] })
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