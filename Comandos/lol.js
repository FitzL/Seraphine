const { Command } = require("../modulos/MCommand.js");
const https = require("https");
const leagueURL = "https://americas.api.riotgames.com/";
const { leagueKey } = require("../secret.json");

prototype = {
    alias: ["lol"], //nombre del comando
    descripcion: "", // que hace
    costo: 0, //cuanto cuesta
    testing: false, //se está probando?
    callback: async (args, message, client, system) => {
        let a = args[0]
        if (!a) return message.reply("a quien te gustaría buscar?");

        a = a.split(/#/);
        if (a.length != 2) return message.reply("Pasame los usuarios en formato `usuario#tag` gil"); 

        let username = a[0];
        let tag = a[1];

        let user = await getpuuid(username, tag);

        console.log(user);

        let embed = new system.embed()
            .setThumbnail()
            .setTitle()
            .setColor(client.member.displayColor)
            .addFields(
                { name: '\u200b', value: '\u200b', inline: true },
            );
        message.channel.send({ embeds: [embed] })
    },
}

async function getpuuid(username, tag) {
    const userURL = leagueURL + `riot/account/v1/accounts/by-riot-id/${username}/${tag}?api_key=${leagueKey}`;

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
                resolve(data.puuid);
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