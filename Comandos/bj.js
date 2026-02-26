const { mongoClient } = require("../DB/db.js");
const { Command } = require("../modulos/MCommand.js");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, MessageFlags } = require('discord.js');

const nums = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "X", "J", "Q", "k"];
const suits = ["♥", "♦", "♣", "♠"];

const deck = suits.flatMap((s) =>
  nums.map((n) =>
    n + s
  )
);

const MaxBet = 2_000;
const MinBet = 50;

const defaultBoardMessage = "Press start to play!";

prototype = {
  alias: ["bj"], //nombre del comando
  descripcion: "Black Jack", // que hace
  costo: 5, //cuanto cuesta
  testing: true, //se está probando?
  callback: async (args, message, client, system) => {
    let bet = Math.min(parseInt(args[0]) || 50, MaxBet);

    const board = new system.embed()
      .setColor(client.member.displayColor)
      .setTitle("Let's play!")
      .setDescription(defaultBoardMessage + ` Players:\n ${message.author}`)

    const Start = new ButtonBuilder()
      .setCustomId("start")
      .setLabel("Start!")
      .setStyle(1)

    const Join = new ButtonBuilder()
      .setCustomId("join")
      .setLabel("Join!")
      .setStyle(1)

    const Buttons = new ActionRowBuilder()
      .addComponents([Start, Join])

    message.reply({
      embeds: [board],
      components: [Buttons]
    }).then((reply) => {
      collector = reply.createMessageComponentCollector({
        componentType: ComponentType.Button, time: 30_000  
      })

      // handle button interactions
      collector.on('collect', (i) => {
        collector.resetTimer();

        let players = [message.author.id];

        if (i.customId == 'start') {
          console.log("Starting game!", i.user.id);

          collector.stop();
          
          new Game(players, bet, message, board).start();

        }

        if (i.customId == 'join') {
          console.log("Joining game!", i.user.id);
          
          if (!players.includes(i.user.id)) players.push(i.user.id);
            i.update({
              embeds: [board.setDescription(
                defaultBoardMessage + " Players:\n" +
                "<@" + players.join("> \n<@") + ">"
              )]
            })

          console.log(players);
          return;
        }

        i.deferUpdate();
      })

      // dispose of buttons
      collector.on('end', collected => {
        reply.edit({
          components: []
        })
      })
    })
  }
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

class Game {
  players = [];
  bet;
  originalMessage;
  deck = [];
  currPlayer;
  dealer;

  constructor(players = [], bet = 200, ogm, board) {
    this.players = players;
    this.bet = bet;
    this.originalMessage = ogm;
    this.dealer = new Dealer(this.bet);
  }

  start() {
    console.log("Game started!");
    this.deck = deck;
    shuffle(this.deck);
    console.log(this.deck);

    
  }

  drawOne() {
    return this.deck.pop();
  }
}

class Player {
  cards = [];
  dbuser;

  constructor(dbuser) {
    this.dbuser = dbuser;
  }

  getTotal() {
    tot = 0;
    if (this.cards.length < 1) return tot;
    for (card in this.cards) {
      tot += nums.indexOf(card[0]) + 1
    }
    return tot;
  }

  checkHand() {
    if (this.getTotal() > 21) return false;
  }
}

class Dealer extends Player{
  pot = 0;
  dbuser;

  constructor(bet) {
    this.dbuser = mongoClient.client;
    this.betSize = bet;
    this.pot = this.calculatePot();
  }

  calculatePot(players = []) {
    return players.length
  }
}

//stolen code, didnt feel like writting my own
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i

    // swap elements array[i] and array[j]
    // we use "destructuring assignment" syntax to achieve that
    // you'll find more details about that syntax in later chapters
    // same can be written as:
    // let t = array[i]; array[i] = array[j]; array[j] = t
    [array[i], array[j]] = [array[j], array[i]];

  }
}