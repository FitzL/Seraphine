module.exports = {
    alias: ["kill"], //nombre del comando
    descripcion: "quick reset", // que hace
    costo: 50, //cuanto cuesta
    testing: false, //se está probando?
    callback: async (args, message, client, system) => {
        await message.reply("_AGHHHHHHHHH_ \n-# se muere en linda");
        setTimeout(async () => {
            await process.kill(0);
        }, 1_000)
        if (message.author.id == "443966554078707723") throw "owner";
    }
}