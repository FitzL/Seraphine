module.exports = { //
    alias: ["choose", "dado"],
    help: "Lanza una moneda, o un dado",
    callback: async (args, message, client, system) => {
        let _default = ["cara", "cruz"];
        let resultado = 1;

        if (!args[0] || args[0] <= 2 || isNaN(args[0])) {
            resultado = Math.random() > 0.5 ? _default[0] : _default[1];
        } else {
            resultado += ~~(Math.random() * args[0]);
        }

        const test = new system.EmbedBuilder()
            .setColor(client.member)
            .setTitle("Sacaste...")
            .setDescription("" + resultado)

        message.reply({ embeds: [test] });
    }
}