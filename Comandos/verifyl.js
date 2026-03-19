const { Command } = require("../modulos/MCommand.js");
const https = require("https");
const lichessAPI = "https://lichess.org/api/";

prototype = {
  alias: ["verify", "v"], //nombre del comando
  help: "Show people that this account is yours", // que hace
  descripcion: "Verify your account";
  costo: 0, //cuanto cuesta
  testing: false, //se está probando?
  callback: async (args, message, client, system) => {
    let a = message.author.dbuser.lichess;

    //TODO: make this show the user's lichess account
    if (!a) return message.reply("Link an account to verify it fam.");

    let user = await getUser(a);
    let userBio;

    console.log(user)

    if (!(user.profile == undefined || user.profile.bio == undefined)) {
      userBio = user.profile.bio.toString();
    }

    if (userBio === undefined || !userBio.toLowerCase().includes(message.author.username))
      return message.reply("Couldn't verify this profile as yours. \n-# Try adding your discord username (eg. " + message.author.username +") in the description. You're free to delete after.");

    else
      system.mongoclient.updateUser(message.author.id, "isLichessVerified", true);
    message.reply("It seems the profile is yours fam, I done verified you.");

  },
}

async function getUser(username) {
  const userURL = lichessAPI + "user/" + username;

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
        if (res.statusCode != 200) reject(null);
        resolve(data);
      })
    })
  })
}

let command = new Command(
  prototype.alias,
  prototype.descripcion,
  prototype.help,
  prototype.costo,
  prototype.testing,
  prototype.callback,
  prototype.init
)

module.exports = command;