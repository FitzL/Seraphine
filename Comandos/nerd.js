module.exports = {
    alias: ["boop"], //nombre del comando
    descripcion: "boop", // que hace
    costo: 1, //cuanto cuesta
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

        await message.channel.send("boop <@" + target.id + ">");
        message.delete();
    }
}