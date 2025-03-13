module.exports = {
    alias: ["premio", "reward", "givebox", "regalar"], //nombre del comando
    descripcion: "", // que hace
    costo: 65, //cuanto cuesta
    testing: false, //se está probando?
    callback: async (args, message, client, system) => {
        let error = false;

        let target = message.mentions.users.first() || await system.findOneMember(args[0]);
        if (!target) return message.reply("Y a quien se lo mando?");
        target = await system.mongoclient.findUser(target.id);

        if (target._id == message.author.id) {
            await message.reply("'Che, a ti mism@?\nQue patético.");
            await message.channel.send("<:raoralaugh:1343492065954103336>");
            throw "PIFIA";
        }

        await system.mongoclient.addBox(target._id).catch((e) => {
            console.log;
            error = true;
        });

        if (error) throw "err";
        let embed = new system.embed()
            .setColor(message.member.displayColor)
            .setDescription("<@" + target._id + "> ha recibido una caja <:peek:1306437352192872559>" + `\n-# por parte de <@` + message.author.id + `>`)

        return message.channel.send({ embeds: [embed] });
    }
}