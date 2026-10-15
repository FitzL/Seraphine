const { Command } = require("../modulos/MCommand.js");
const https = require("https");
var bt;

prototype = {
  alias: ["image"], //nombre del comando
  descripcion: "Check ping!", // que hace
  costo: 0, //cuanto cuesta
  testing: false, //se está probando?
  callback: async (args, message, client, system) => {
    bt = system.braveKey;
    const results = await imageSearch("9", 1);
    console.log(results);
  }
}

function imageSearch(query, count = 10) {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams({
      q: query,
      count: count.toString(),
      safesearch: "strict"
    })

    const options = {
      hostname: "api.search.brave.com",
      path: `/res/v1/images/search?${params}`,
      method: "GET",
      headers: {
        "X-Subscription-Token": bt,
        "Accept": "application/json"
      }
    };

    const request = https.request(options, response => {
      let data = "";

      response.on("data", chunk => {
        data += chunk;
      });

      response.on("end", () => {
        if (response.statusCode < 200 || response.statusCode >= 300) {
          return reject(
            new Error(`Brave API returned ${response.statusCode}: ${data}`)
          );
        }

        try {
          const json = JSON.parse(data);

          resolve(json.results.map(image => ({
            title: image.title,
            url: image.url,
            thumbnail: image.thumbnail?.src
          })));
        } catch (error) {
          reject(error);
        }
      })
    })


    request.on("error", reject);

    request.end();

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