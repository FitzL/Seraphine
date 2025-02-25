module.exports = {
    alias: ["name", "nombrar", "apodo"],
    descripcion: "Cambia el nickname de otro usuario.",
    costo: 7,
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
            return message.reply("Como chucha le pongo?");
            throw "not valid args";
        };

        await target.setNickname(args.join(" ")).catch(async (err) => {
            await message.channel.send("No pude cambiarle el nombre...");
            message.delete();
            throw err;
        })

        await message.channel.send("Nombre cambiado 👻");

        message.delete();
        return;
    }
}