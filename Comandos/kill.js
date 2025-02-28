module.exports = {
    alias: ["kill"], //nombre del comando
    descripcion: "quick reset", // que hace
    costo: 0, //cuanto cuesta
    testing: true, //se está probando?
    callback: async (args, message, client, system) => {
        await message.reply("_AGHHHHHHHHH_ \n-# se muere en linda");
        process.kill(0);
    }
}