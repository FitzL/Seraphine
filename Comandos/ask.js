const { Command } = require("../modulos/MCommand.js");
const { GoogleGenAI } = require("@google/genai");
const { GeminiKey, SeraphinePrompt } = require("../secret.json")
const SereneText = require("../AI-src/serene-text.json").content;
const AI = new GoogleGenAI({ apiKey: GeminiKey });
const everyjuan = new RegExp("@everyone" + "|@here" + "|<@&..+>", "gi");

prototype = {
    alias: ["ask"], //nombre del comando
    descripcion: "Preguntalé a Serafín (Gemini)", // que hace
    costo: 5, //cuanto cuesta
    testing: false, //se está probando?
    callback: async (args, message, client, system) => {
        const response = await AI.models.generateContent({
            model: "gemini-2.0-flash-001",
            contents: args.join(" "),
            config: {
                systemInstruction: (SeraphinePrompt + "\nUsa estas frases de ejemplo, las palabras en brackets son personas\n" + SereneText.join("\n"))
            }
        })

        message.reply(sanitise(response.text))
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

function sanitise(str) {
    return str.replaceAll(everyjuan, "`no`");
}

module.exports = command;