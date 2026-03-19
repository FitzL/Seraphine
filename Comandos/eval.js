const { Command } = require("../modulos/MCommand.js");
const { mongoClient } = require('../db/db.js');

prototype = {
	alias: ["sudo", "eval"],
	descripcion: "Run any code",
	testing: true,
	costo: 0,
	callback: async (args, message, client, system) => {
		if (system.onwerid != message.author.id) {
			message.reply("Only fitz");
			return;
		}

		try {
			await eval("(async () => {" +
					args.join(" ") +
					"})()"
					);
		} catch (err) {
			console.log(err);
			message.reply("Syntax Error.");
		};
	}
}

let command = new Command(
	prototype.alias,
	prototype.descripcion,
	prototype.help,
	prototype.costo,
	prototype.testing,
	prototype.callback,
	prototype.init
)

module.exports = command;