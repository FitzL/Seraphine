const { Command } = require("../modulos/MCommand.js");

prototype = {
    alias: ["report", "reportar"], //nombre del comando
    descripcion: "", // que hace
    costo: 0, //cuanto cuesta
    testing: false, //se está probando?
    callback: async (args, message, client, system) => {
        let blacklist = ["567493815481663508"]

        if (blacklist.includes(message.author.id)) return message.reply("No voy a recibir reportes de tu parte.")
        if (!args[0]) return message.reply("Como vas a mandar un reporte vacio, gil")

        let report = await client.users.send("443966554078707723",
            `Reporte de ${message.author.displayName}(${message.author.id}):\n\`\`\`` +
            args.join(" ") +
            `\`\`\``
        );

        report.react("✅");
        report.react("❌");

        message.reply("Reporte enviado.")
    },
    init: async (args, message, client, system) => {
        console.log(this);
        console.log("hellow world")
        return args;
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