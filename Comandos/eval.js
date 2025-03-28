const { Command } = require("../modulos/MCommand.js");

prototype = {
	alias: ["sudo", "eval"],
	descripcion: "Corre codigo arbitrario",
	testing: true,
	costo: 0,
	callback: async (args, message, client, system) => {
		if (system.onwerid != message.author.id) {
			message.reply("Por ahora solo fitz puede tocar esto, sry");
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
	prototype.costo,
	prototype.testing,
	prototype.callback,
	prototype.init
)

module.exports = command;