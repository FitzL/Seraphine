module.exports = {
    alias: ["fuck"], //nombre del comando
    descripcion: "", // que hace
    costo: 0, //cuanto cuesta
    testing: false, //se está probando?
    callback: async (args, message, client, system) => {
        await message.reply("Cochino <:emputao:1126997425626816632>");
    }
}