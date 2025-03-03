exec = require("child_process").execFile;	

module.exports = {
	alias: ["sudo", "eval"],
	descripcion: "Corre codigo arbitrario",
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
			message.reply("Syntax Error.")
		};
	}
}
