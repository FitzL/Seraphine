const { Command } = require("../modulos/MCommand.js");
const { createCanvas } = require('canvas')
const fs = require('fs');
const path = require('path');

prototype = {
    alias: ["percent", "porciento", "perc", "porc"], //nombre del comando
    descripcion: "Porcentages pues.", // que hace
    costo: 0, //cuanto cuesta
    testing: false, //se está probando?
    callback: async (args, message, client, system) => {
        let baseValue = 0;
        let percent = 0;

        percent = args[0][args[0].length-1] == "%" ? args[0].slice(0, -1) : args[1][args[1].length -1] == "%" ? args[1].slice(0, -1) : null;
        baseValue = args[0][args[0].length-1] == "%" ? parseInt(args[1]) : parseInt(args[0]);

        if (percent == null || !args[0] || !args[1]) return message.reply("Pendejo.");


        results = "Valor inicial:" +
        "```" +
        baseValue + // I don't want them in order now :3
        "```" +
        "Porcentaje: " +
        "```" +
        percent + "%"
        + "```" +
        "Valor Final: " +
        "```" +
        (baseValue * percent * 0.01)
        + "```" +
        "+" + percent + "%: " +
        "```" +
        (baseValue + Math.round(baseValue * (percent * 0.01)))
        + "```" +
        "-" + percent + "%: " +
        "```" +
        (baseValue - Math.round(baseValue * (percent * 0.01)))
        + "```";

        if (results.length > 4096) {
            await message.reply("Eso es demasiado grande para mi uwu");
            throw "EMBED_CONTENT_EXCEDEED_MAX";
        }

        let outputEmbed = new system.embed()
            .setDescription(results)
            .setColor(message.member.displayColor)

        message.channel.send({
            embeds: [outputEmbed],
        });
    },
    init: async (args, message, client, system) => {
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