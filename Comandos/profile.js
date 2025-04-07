const { Command } = require("../modulos/MCommand.js");

prototype = {
    alias: ["perfil", "p", "profile"], //nombre del comando
    descripcion: "muestra el perfil", // que hace
    costo: 0, //cuanto cuesta
    callback: async (args, message, client, system) => {
        let user = message.author.dbuser;
        let discorduser = message.member;

        let target = message.mentions.members.first() || await system.findOneMember(args[0], message);

        console.log(target)

        if (target) { 
            try  {
                user = await system.mongoclient.findUser(target.id);
                user = new system.dbuser(
                    user._id.toString(),
                    user.username,
                    user.xp,
                    user.lvl,
                    user.currency,
                    user.lastActivity,
                    user.nextXp,
                    user.nextPay,
                    user.cajas,
                );
            }
            catch(e) {
                console.log(e);
                let dbuser = new system.dbuser(target.id, target.displayName);
                await system.mongoclient.insertUser(dbuser);
                user = dbuser;

                console.log(dbuser);
            };
            discorduser = target;
        }


        let embed = new system.embed()
            .setColor(discorduser.displayColor)
            .setThumbnail(discorduser.user.displayAvatarURL())
            .setTitle(discorduser.displayName)
            .addFields(
                { name: "Dinero", value: user.currency.toString() + system.currency},
                { name: "ingreso", value: user.pay().toString() + system.currency, inline: true },
                { name: "XP", value: user.xp.toString(), inline: true },
                { name: "Lvl", value: user.lvl.toString(), inline: true },
                { name: "Cajas", value: user.cajas.toString() + "📦", inline: true }
            );
        message.channel.send({ embeds: [embed]})
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