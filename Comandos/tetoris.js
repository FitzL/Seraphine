const { Command } = require("../modulos/MCommand.js");
const https = require("https");
const tetrioURL = "https://ch.tetr.io/api/";

prototype = {
    alias: ["tetris", "tetoris", "teto"], //nombre del comando
    descripcion: "", // que hace
    costo: 0, //cuanto cuesta
    testing: false, //se está probando?
    callback: async (args, message, client, system) => {
        let a = args[0];

        if (!a) return message.reply("a quien te gustaría buscar?");

        let user = await getUser(a);
        let userSummary = await getUserSumaries(a);

        let embed = new system.embed()
            .setThumbnail(`https://tetr.io/user-content/avatars/${user._id}.jpg?rv=${ user.avatar_revision }`)
            .setTitle(user.username)
            .setColor(client.member.displayColor)
            .addFields(
                { name: "Juegos totales:", value: user.gamesplayed.toString()},
                { name: "Tpp Global 40L:", value: userSummary["40l"].rank.toString(), inline: true },
                { name: "Top Local 40L:", value: userSummary["40l"].rank_local.toString(), inline: true },
                { name: '\u200b', value: '\u200b' , inline: true},
                { name: "Top Global League:", value: (userSummary.league.standing == -1 ? "N/A" : userSummary.league.standing ).toString(), inline: true },
                { name: "Top Local league:", value: (userSummary.league.standing_local == -1 ? "N/A" : userSummary.league.standing_local).toString(), inline: true },
                { name: '\u200b', value: '\u200b', inline: true },
            );
        message.channel.send({ embeds: [embed] })
    },
}

async function getUserSumaries(username) {
    userSummaryURL = tetrioURL + "users/" + username + "/summaries";

    return new Promise ((resolve, reject) => {
        https.get(userSummaryURL, (res) => {
            let buffer = "";
            let data;

            console.log('statusCode:', res.statusCode);

            if (res.statusCode == "404") return null;

            res.on("data", (chunk) => {
                buffer += chunk;
            })

            res.on("end", (err) => {
                data = JSON.parse(buffer);
                if (!data.success) reject(null);
                resolve(data.data);
            })
        });
    })
}

async function getUser(username) {
    const userURL = tetrioURL + "users/" + username;

    return new Promise((resolve, reject) => {
        https.get(userURL, (res) => {
            var buffer = "";
            var data;

            console.log('statusCode:', res.statusCode);

            res.on("data", (chunk) => {
                buffer += chunk;
            })

            res.on("end", async (err) => {
                data = await JSON.parse(buffer);
                if (!data.success) reject(null);
                resolve(data.data);
            })
        })
    })
}

let command = new Command(
    prototype.alias,
    prototype.descripcion,
    prototype.costo,
    prototype.testing,
    prototype.callback,
    prototype.init
)

module.exports = command;