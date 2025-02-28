module.exports = {
    alias: ["imitar", "copy"], //can have multiple but would recommend keeping it under two
    descripcion: "Me hago pasar por alguien más.", //shouldn't exceed two lines.
    costo: 15,
    test: false,
    callback: async (args, message, client, system) => {
        let target = message.mentions.members.first();
        if (!message.mentions.replieduser) args.shift();
        if (!target) {
            return message.reply("No se a quien impersonar...");
        }
        if (!args[0]) {
            return message.reply("No se que quieres que diga...");
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