module.exports = {
    alias: ["say"], //nombre del comando
    descripcion: "", // que hace
    costo: 0, //cuanto cuesta
    testing: true, //se está probando?
    callback: async (args, message, client, system) => {
        let channel = await message.guild.channels.fetch(args[0]).catch((e) => { console.log }) || message.mentions.channels.first();
        if (channel == undefined) channel = message.channel;
        else args.shift();

        let content = addEveryone(args.join(" "));

        channel.send(content);
        message.delete();
    }
}

function addEveryone(str) {
    str = str.replace("[everyjuan]", "@everyone");
    str = str.replace("[everyone]", "@everyone");
    str = str.replace("[here]", "@here");
    return str;
}