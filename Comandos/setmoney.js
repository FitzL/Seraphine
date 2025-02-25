module.exports = {
    alias: ["setmoney", "imprimir"], //nombre del comando
    descripcion: "Ajusta manualmente el dinero", // que hace
    testing: true,
    costo: 0, //cuanto cuesta
    callback: async (args, message, client, system) => {
        let dbuser = message.author.dbuser;
        if (args[1] && !message.mentions.users.first()) {
            dbuser = await system.mongoclient.findUser(args[1])
        } else if (args[1]) {
            dbuser = await system.mongoclient.findUser(message.mentions.users.first().id)
        };

        let amount = parseInt(args[0]);
            
        console.log(amount);

        await system.mongoclient.updateUser(dbuser._id, "currency", amount);

        let embed = new system.embed()
            .setColor(message.member.displayColor)
            .setDescription("Has configurado el balance de <@" + dbuser._id + "> a " + amount + system.currency + "!");

        return message.channel.send({ embeds: [embed] });
    }
}