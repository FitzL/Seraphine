const { Command } = require("../modulos/MCommand.js");
const { createCanvas } = require('canvas')
const fs = require('fs');
const path = require('path');

prototype = {
    alias: ["roll", "dice"], //nombre del comando
    descripcion: "Lanza uno o mas dados", // que hace
    costo: 0, //cuanto cuesta
    testing: false, //se está probando?
    callback: async (args, message, client, system) => {
        let dice = {};
        let results = [];

        for (let arg in args) {
            let die = args[arg].split("d");

            if (die.length != 2) continue;
            if (isNaN(die[0]) || isNaN(die[1])) continue;

            dice[die[1]] = die[0];
        }

        if (Object.values(dice).length < 1) dice = {20: 2}

        for (let die in dice) {
            let dieFace = die; 
            let diceAmount = dice[die];
            let diceResults = [];

            for (let i = 0; i < diceAmount; i++) {
                diceResults.push((1 + ~~(Math.random() * die)));
            }

            

            results.push(
                diceAmount + "d" + dieFace  +
                "```" +
                (diceResults/*.sort((a, b) => { return a - b })*/).join(", ") + // I don't want them in order now :3
                "```" +
                "Total: " +
                "```" +
                (diceResults.reduce((curr, tot) => curr + tot))
                + "```" +
                "Min: " +
                "```" +
                (Math.min(...diceResults))
                + "```" +
                "Max: " +
                "```" +
                (Math.max(...diceResults))
                + "```" 
            );
        }

        if (results.join(" ").length > 4096) {
            message.reply("Eso es demasiado grande para mi uwu");
            throw "EMBED_CONTENT_EXCEDEED_MAX";
        }

        let outputEmbed = new system.embed()
            .setDescription(results.join(" "))
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