module.exports = {
    alias: ["ping"], //nombre del comando
    descripcion: "", // que hace
    costo: 0, //cuanto cuesta
    testing: false, //se está probando?
    callback: async (args, message, client, system) => {
        let _message = await message.reply("Pong!");
        let startTime = message.createdTimestamp;
        await _message.edit("Pong! " + (_message.createdTimestamp - startTime) + "ms.");
    }
}