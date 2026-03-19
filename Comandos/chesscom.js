const { Command } = require("../modulos/MCommand.js");
const https = require("https");
const chesscomURL = "https://api.chess.com/pub/";
const decimals = 1;

prototype = {
  alias: ["chesscom", "chesscum", "cc", "c"], //nombre del comando
  descripcion: "Pull up a chesscom profile", // que hace
  help: "Get statistics about a chess.com profile. You can also get someone's profile if they have their's linked",
  costo: 1, //cuanto cuesta
  testing: false, //se está probando?
  callback: async (args, message, client, system) => {
    let a = args[0] || message.author.dbuser.lichess;
    if (message.mentions.members.first()) {
      let dbu = await mongoClient.findUser(message.mentions.members.first().id)
      if (dbu.lichess !== null) {
        a = dbu.lichess;
      } else {
        a = undefined;
      }
    }

    //TODO: make this show the user's lichess account
    if (message.mentions.members.first() && !a) return message.reply("They don't have a linked account");
    else if (!a) return message.reply("Who am I looking for?"); 

    let user = await getUser(a);
    if (!user) return message.reply("Couldn't find them fam");
    let userRatings = await getUserRatings(a);

    let bullet = userRatings.chess_bullet.last.rating.toString();
    let blitz = userRatings.chess_blitz.last.rating.toString()
    let rapid = userRatings.chess_rapid.last.rating.toString()

    let totalBulletGames = userRatings.chess_bullet.record.win + userRatings.chess_bullet.record.loss + userRatings.chess_bullet.record.draw;
    let totalBlitzGames = userRatings.chess_blitz.record.win + userRatings.chess_blitz.record.loss + userRatings.chess_blitz.record.draw;
    let totalRapidGames = userRatings.chess_rapid.record.win + userRatings.chess_rapid.record.loss + userRatings.chess_rapid.record.draw;

    let bulletWR = "" +
      (userRatings.chess_bullet.record.win / totalBulletGames * 100).toFixed(decimals) + "% W" +"\n" +
      (userRatings.chess_bullet.record.loss / totalBulletGames * 100).toFixed(decimals) + "% L" + "\n" +
      (userRatings.chess_bullet.record.draw / totalBulletGames * 100).toFixed(decimals) + "% D"

    let blitztWR = "" +
      (userRatings.chess_blitz.record.win / totalBlitzGames * 100).toFixed(decimals) + "% W" + "\n" +
      (userRatings.chess_blitz.record.loss / totalBlitzGames * 100).toFixed(decimals) + "% L" + "\n" +
      (userRatings.chess_blitz.record.draw / totalBlitzGames * 100).toFixed(decimals) + "% D"

    let rapidtWR = "" +
      (userRatings.chess_rapid.record.win / totalRapidGames * 100).toFixed(decimals) + "% W" + "\n" +
      (userRatings.chess_rapid.record.loss / totalRapidGames * 100).toFixed(decimals) + "% L" + "\n" +
      (userRatings.chess_rapid.record.draw / totalRapidGames * 100).toFixed(decimals) + "% D"

    let embed = new system.embed()
      .setThumbnail(user.avatar) 
      .setTitle(user.username + ((!args[0] && message.author.dbuser.isLichessVerified) ? "(verified)" : ""))
      .setURL(user.url)
      .setColor(message.member.displayColor)
      .addFields(
        { name: "Bullet: ", value: bullet, inline: true },
        { name: "Blitz: ", value: blitz, inline: true },
        { name: "Rapid: ", value: rapid, inline: true },
        { name: "Bullet WR: ", value: bulletWR, inline: true },
        { name: "Blitz WR: ", value: blitztWR, inline: true },
        { name: "Rapid WR: ", value: rapidtWR, inline: true },
      );
    message.channel.send({ embeds: [embed] })
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
      },{
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

async function getUserRatings(username) {
  const userURL = chesscomURL + "player/" + username.toLowerCase() + "/stats";
  const res = await fetch(userURL);
  if (res.status != 200) reject(null);

  const data = await res.json();

  return data;

  console.log(data);

  return new Promise((resolve, reject) => {
    https.get(userURL, (res) => {
      var buffer = "";
      var data;

      console.log('statusCode:', res.statusCode);

      res.on("data", (chunk) => {
        buffer += chunk;
      })

      res.on("end", async (err) => {
        if (res.statusCode != 200) reject(null);
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