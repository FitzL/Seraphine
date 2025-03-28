const { Command } = require("../modulos/MCommand.js");

const {
    translate,
    Translator,
    speak,
    singleTranslate,
    batchTranslate,
    languages,
    isSupported,
    getCode
} = require('google-translate-api-x');

prototype = {
    alias: ["tr", "translate", "trad", "traducir"], //nombre del comando
    descripcion: "Traduce un mensaje", // que hace
    costo: 1, //cuanto cuesta
    testing: false, //se está probando?
    callback: async (args, message, client, system) => {
        let lang = args.pop();
        translation = "";


        try {
            await translate(args.slice().join(" "), { to: lang }).then((res) => {
                translation = res.text;
            })
        } catch (e) {
            args.push(lang);
            await translate(args.join(" "), { to: 'es' }).then((res) => {
                translation = res.text;
            })
        }

        target = message.member;
        message.delete();

        let webhookUsername = target.displayName || target.username;
        let pfp = target.user.avatarURL().toString();

        const webhook = await message.channel.createWebhook({
            name: webhookUsername,
            avatar: pfp,
        })
        await webhook.send(translation);
        webhook.delete();
    }
}

let command = new Command(
    prototype.alias,
    prototype.descripcion,
    prototype.costo,
    prototype.testing,
    prototype.callback,
    prototype.init
)

module.exports = command;