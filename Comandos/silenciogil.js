module.exports = {
    alias: ["silenciogil", "silencio", "calla"], //nombre del comando
    descripcion: "boop", // que hace
    costo: 22, //cuanto cuesta
    testing: false, //se está probando?
    callback: async (args, message, client, system) => {
        let id = args.shift();

        // try to catch the first user mention in message
        let target = message.mentions.users.first();
        // if no mentions treat first argument like an id
        target = target ? await system.getMember(target.id) : await system.getMember(id);

        if (!target) {
            message.reply("Ni idea de quien hablas.");
            throw "user not found";
        };
        if (!args) {
            message.reply("Como chucha le pongo?");
            throw "not valid args";
        };

        if (target.id == client.user.id) {
            message.reply("Pero si eesa soy yo?");
            throw "pifia";
            return;
        }

        await target.timeout(20_000, 'kyc').catch(async (err) => {
            await message.channel.send("No lo puedo silenciar al hdp");
            message.delete();
            throw err;
        })

        await message.channel.send("silencio gil <@" + target.id + ">");

        message.delete();
        return;
    }
}