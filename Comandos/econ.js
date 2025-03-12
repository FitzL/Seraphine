module.exports = {
    alias: ["econ"], //nombre del comando
    descripcion: "", // que hace
    costo: 5, //cuanto cuesta
    testing: false, //se está probando?
    callback: async (args, message, client, system) => {
        let users = await system.mongoclient.users.find({
            _id: {
                '$ne': client.user.id,
            },
            currency: {
                '$gt': 0,
            }
        }).sort({
            currency: -1,
        }).toArray();

        let total = 0;

        users.forEach((user, i) => {
            if (isNaN(user.currency)) return;
            total += user.currency;
        });

        message.reply(`Hay un total de ${total - 5 + system.currency} en circulación.`)
    }
}