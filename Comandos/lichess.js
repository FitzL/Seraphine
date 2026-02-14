const { Command } = require("../modulos/MCommand.js");
const https = require("https");
const lichessAPI = "https://lichess.org/api/";

prototype = {
  alias: ["lichess", "l"], //nombre del comando
  descripcion: "", // que hace
  costo: 0, //cuanto cuesta
  testing: false, //se está probando?
  callback: async (args, message, client, system) => {
    let a = args[0] || message.author.dbuser.lichess;

    //TODO: make this show the user's lichess account
    if (!a) return message.reply("Who am I looking for?"); 

    let user = await getUser(a);
    if (!user) return message.reply("Couldn't find them.");

    console.log(user)

    let ultraBullet = "1500";
    let ultraBulletProg = false;
    let userBio = "<empty>";

    let happy = "<:emptyhead:1454172508818247710>";
    let sad = "<:yuicry:1343632199609487360>";

    if (!(user.profile == undefined || user.profile.bio == undefined)) {
      userBio = user.profile.bio.toString();
    }

    if (user.perfs.ultraBullet != undefined) { 
      ultraBullet = user.perfs.ultraBullet.rating.toString() || 1500
      ultraBullet += user.perfs.ultraBullet.prov ? "?" : "";
      ultraBulletProg = user.perfs.ultraBullet.prog.toString() || 0
    }
    ultraBulletProg = parseInt(ultraBulletProg) > 0 ? happy : sad;

    let bullet = user.perfs.bullet.rating.toString()
    bullet += user.perfs.bullet.prov ? "?" : "";
    let bulletProg = user.perfs.bullet.prog.toString()
    bulletProg = parseInt(bulletProg) > 0 ? happy : sad;

    let blitz = user.perfs.blitz.rating.toString()
    blitz += user.perfs.blitz.prov ? "?" : "";
    let blitzProg = user.perfs.blitz.prog.toString()
    blitzProg = parseInt(blitzProg) > 0 ? happy : sad;

    let rapid = user.perfs.rapid.rating.toString()
    rapid += user.perfs.rapid.prov ? "?" : "";
    let rapidProg = user.perfs.rapid.prog.toString()
    rapidProg = parseInt(rapidProg) > 0 ? happy : sad;

    let classical = user.perfs.classical.rating.toString()
    classical += user.perfs.classical.prov ? "?" : "";
    let classicalProg = user.perfs.classical.prog.toString()
    classicalProg = parseInt(classicalProg) > 0 ? happy : sad;

    let embed = new system.embed()
      //.setThumbnail() TODO: check what can you put here
      .setTitle(user.username + ((!args[0] && message.author.dbuser.isLichessVerified) ? "(verified)" : ""))
      .setURL(user.url)
      .setColor(message.member.displayColor)
      .addFields(
        { name: "Bio: ", value: userBio },
        { name: ultraBulletProg + " UltraBullet: ", value: ultraBullet , inline: true },
        { name: bulletProg + " Bullet: ", value: bullet , inline: true },
        { name: blitzProg + " Blitz: ", value: blitz , inline: true },
        { name: rapidProg + " Rapid: ", value: rapid , inline: true },
        { name: classicalProg + " Classical: ", value: classical , inline: true },
        { name: "Total Games: ", value: user.count.all.toString() + ` (${user.count.rated.toString()} rated)`, inline: true },
      );
    message.channel.send({ embeds: [embed] })
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
        if (res.statusCode != 200) reject(null);
        data = await JSON.parse(buffer);
        resolve(data);
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