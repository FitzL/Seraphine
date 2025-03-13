module.exports = {
    alias: ["ping"], //nombre del comando
    descripcion: "", // que hace
    costo: 0, //cuanto cuesta
    testing: false, //se está probando?
    callback: async (args, message, client, system) => {
        await message.reply("Pong!").then(async (_message) => {
            await _message.edit("Pong! " +
                "\n-# ping: " + (_message.createdTimestamp - message.createdTimestamp).toString()
            );
        });

    }
}