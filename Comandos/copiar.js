module.exports = {
    alias: ["imitar", "copy"], //can have multiple but would recommend keeping it under two
    descripcion: "Me hago pasar por alguien más.", //shouldn't exceed two lines.
    costo: 15,
    test: false,
    callback: async (args, message, client, system) => {
        let id = args[0];
        let target = message.mentions.users.first();

        target = target ? await system.getMember(target.id) : await system.getMember(id);

        if (!message.mentions.replieduser) args.shift();

        if (!target) {
            message.reply("No se a quien impersonar...");
            throw "error";
        }
        if (!args[0]) {
            message.reply("No se que quieres que diga...");
            throw "error";
        }


        let webhookUsername = target.displayName || target.username;
        let pfp = target.user.avatarURL().toString();

        const webhook = await message.channel.createWebhook({
            name: webhookUsername,
            avatar: pfp,
        })
        await webhook.send(args.join(" "));
        webhook.delete();
        message.delete();
    }
}