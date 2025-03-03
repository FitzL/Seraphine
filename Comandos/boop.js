module.exports = {
    alias: ["boop"], //nombre del comando
    descripcion: "boop", // que hace
    costo: 1, //cuanto cuesta
    testing: false, //se está probando?
    callback: async (args, message, client, system) => {
        let id = args.shift();
        let target = message.mentions.users.first();
        target = target ? await system.getMember(target.id) : await system.getMember(id);

        if (!target) {
            message.reply("Ni idea de quien hablas.");
            throw "user not found";
        };

        await message.channel.send("_boop_ <@" + target.id + ">");
        message.delete();
    }
}