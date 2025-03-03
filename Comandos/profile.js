module.exports = {
    alias: ["perfil", "p", "profile"], //nombre del comando
    descripcion: "muestra el perfil", // que hace
    costo: 0, //cuanto cuesta
    callback: async (args, message, client, system) => {
        let user = message.author.dbuser;
        let discorduser = message.member;

        let target = message.mentions.members.first();

        if (target) { 
            try  {
                user = await system.mongoclient.findUser(target.id);
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
                { name: "Plata", value: user.currency.toString() + system.currency, inline: true },
                { name: "XP", value: user.xp.toString(), inline: true },
                { name: "Lvl", value: user.lvl.toString(), inline: true },
                { name: "Cajas", value: `Todavía no las meto`, inline: true }
            );
        message.channel.send({ embeds: [embed]})
    }
}