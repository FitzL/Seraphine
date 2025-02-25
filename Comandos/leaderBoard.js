module.exports = {
    alias: ["lb", "top"], //nombre del comando
    descripcion: "", // que hace
    costo: 0, //cuanto cuesta
    testing: false, //se está probando?
    callback: async (args, message, client, system) => {
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


        let n = 10;

        let embed = new system.embed()
            .setColor(client.member.displayColor)
            .setTitle("El top " + n + " de panaderos.")

        let top5 = users.slice(0, n);

        lbEntries = [];

        top5.forEach((user, i) => {
            lbEntries.push(
                `${i + 1}. <@${user._id}>: ${user.currency}${system.currency}  lvl: ${user.lvl}`
            );
        });

        embed.setDescription(lbEntries.join("\n"))

        message.reply({ embeds: [embed] });
    }
};