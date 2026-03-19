const { Command } = require("../modulos/MCommand.js");
const https = require("https");
const chesscomURL = "https://api.chess.com/pub/";
const decimals = 1;

prototype = {
  alias: ["cverify", "cv"], //nombre del comando
  descripcion: "Verify your account!", // que hace
  help: "Verifies that the accounts belongs to you",
  costo: 1, //cuanto cuesta
  testing: false, //se está probando?
  callback: async (args, message, client, system) => {
    let a = message.author.dbuser.chesscom;

    if (!a) return message.reply("Try linking account first fam.");

    let user = await getUser(a);

    if (!user.name.includes(message.author.username))
      return message.reply("Couldn't verify this profile as yours. \n-# Try adding your discord username (eg. " + message.author.username +") in the description. You're free to delete after.");
    else
      system.mongoclient.updateUser(message.author.id, "isChesscomVerified", true);
    message.reply("It seems the profile is yours fam, I done verified you.");
  },
}

async function getUser(username) {
  const userURL = chesscomURL + "player/" + username.toLowerCase();
  const res = await fetch(userURL);
  if (res.status != 200) reject(null);

  const data = await res.json();

  return data;

  console.log(userURL)

  return new Promise((resolve, reject) => {
    https.get(userURL, (res) => {
      var buffer = "";
      var data;

      console.log('statusCode:', res.statusCode);

      res.on("data", (chunk) => {
        buffer += chunk;
      }, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
          "Accept": "text/html,application/xhtml+xml",
          "Accept-Language": "en-US,en;q=0.9",
        }
      })

      res.on("end", async (err) => {
        console.log(buffer)
        if (res.statusCode != 200) reject(null);
        data = await JSON.parse(buffer);
        resolve(data.data);
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