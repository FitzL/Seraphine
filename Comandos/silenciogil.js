module.exports = {
    alias: ["silenciogil", "silencio", "calla"], //nombre del comando
    descripcion: "boop", // que hace
    costo: 30, //cuanto cuesta
    testing: false, //se está probando?
    callback: async (args, message, client, system) => {
        let id = args.shift();

        // try to catch the first user mention in message
        let target = message.mentions.members.first() || await system.findOneMember(id);
        troll = Math.random() < 0.075 ;

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
            throw "PIFIA";
            return;
        }

        if (troll) {
            target = message.member;
            await target.timeout(15_000, 'kyc').catch(async (err) => {
                await message.channel.send("no?");
                message.delete();
                throw err;
            })

            await message.channel.send("<:raoralaugh:1343492065954103336> <@" + target.id + ">");

            message.delete();
            return;
        }

        await target.timeout(30_000, 'kyc').catch(async (err) => {
            await message.channel.send("No lo puedo silenciar al hdp");
            message.delete();
            throw err;
        })

        await message.channel.send("silencio gil <@" + target.id + ">");

        message.delete();
        return;
    }
}