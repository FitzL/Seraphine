module.exports = {
    alias: ["lolcd", "cooldown"], //nombre del comando
    descripcion: "", // que hace
    callback: async (args, message, client, system) => {
        let cd = args[0];
        let ah = args[1];

        cd = parseFloat(cd) || 0;
        ah = parseFloat(ah) || 0;
        ah = 100 / (100 + ah);
        cdr = ~~(ah * cd * 100) / 100;


        message.reply("El cd baja de " + cd + " base, a " + cdr + ".")
        return;
    }
}