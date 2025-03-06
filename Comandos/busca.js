module.exports = {
    alias: ["busca"], //nombre del comando
    descripcion: "", // que hace
    costo: 0, //cuanto cuesta
    testing: true, //se está probando?
    callback: async (args, message, client, system) => {
        let keyword = args[0];

        let guildMembers = Array.from(await message.guild.members.fetch()); //, ([id, user]) => { id, user }
        let users = [];

        guildMembers.forEach((member, id) => {
            users.push(
                {
                    id:  member[1].id,
                    username: member[1].user.username,
                    nickname: member[1].nickname,
                    displayName: member[1].displayName
                }
            )
        })

        let primerMatch = "";

        await users.forEach(async (user) => {
            if (user.username.toLowerCase().match(keyword) || user.nickname && user.nickname.toLowerCase().match(keyword) || user.displayName.toLowerCase().match(keyword)) {
                primerMatch = user.id;
                return;
            }
        })

        message.reply("Este fue el primero que encontré: <@" + primerMatch + ">");
    }
}