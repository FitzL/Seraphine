const { Command } = require("../modulos/MCommand.js");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, MessageFlags } = require('discord.js');
const { mongoClient } = require('../db/db.js');

const nums = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "X", "J", "Q", "k"];
const values = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10]
const suits = ["♥", "♦", "♣", "♠"]; 
var _dbuser;

const decka = suits.flatMap((s) =>
  nums.map((n) =>
    n + s
  )
);

const deckb = suits.flatMap((s) =>
  nums.map((n) =>
    n + s
  )
);

const deckc = suits.flatMap((s) =>
  nums.map((n) =>
    n + s
  )
);

const deck = [decka, deckb, deckc].flat()
const MaxBet = 2_000;
const MinBet = 50;

const defaultBoardMessage = "Press start to play!";

prototype = {
  alias: ["bj"], //nombre del comando
  descripcion: "Black Jack", // que hace
  help: "BJ Miku alone or with \~Friends\~",
  costo: 5, //cuanto cuesta
  testing: true, //se está probando?
  callback: async (args, message, client, system) => {
    _dbuser = await mongoClient.findUser(client.user.id).catch((e) => { console.log })
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
      let players = [message.author.id];

      // handle button interactions
      collector.on('collect', (i) => {
        collector.resetTimer();


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
  prototype.help,
  prototype.costo,
  prototype.testing,
  prototype.callback,
  prototype.init
)

module.exports = command;

class Game {
  _players = [];
  players = [];
  bet;
  originalMessage;
  deck = [];
  currPlayer;
  dealer;

  constructor(_players = [], bet = 200, ogm, board) {
    this._players = _players;
    this.bet = bet;
    this.originalMessage = ogm;
    this.dealer = new Dealer(this.bet);
  }

  async start() {
    this.deck = deck;

    shuffle(this.deck);
    await this.findPlayers();

    this.dealer.calculatePot(this.players.length + 1);
    this.hit(this.dealer);
    this.hit(this.dealer);

    console.log(this.deck);
    console.log(this.players);
    console.log(this.dealer);

    this.hit(this.players[0]);
    this.hit(this.players[0]);
    this.hit(this.players[0]);
    this.hit(this.players[0]);
    this.hit(this.players[0]);


    console.log(this.players);
  }

  drawOne() {
    return this.deck.pop();
  }

  hit(player = new Player()) {
    player.addCard(this.drawOne());
    if (!player.isBust) return;
    console.log("you lost bruv")
  }

  async findPlayers() {
    let i = 0;
    for (let player of this._players) {
      this.players[i++] = new Player(await mongoClient.findUser(player));
    }
  }

  isDealerTurn() {
    areAllPlayersReady = false;
    for (let player of this.players) {
      areAllPlayersReady = areAllPlayersReady || !player.isDone
    }
    return !areAllPlayersReady;
  }
}

class Player {
  hands = [];
  cards = [];
  dbuser;
  isDone = false;
  isBust = false;

  constructor(dbuser) {
    this.dbuser = dbuser;
  }

  getTotal() {
    let tot = 0;
    let aces = 0;
    if (this.cards.length < 1) return tot;
    for (let card of this.cards) {
      let numIndex = nums.indexOf(card[0]);
      if (numIndex === 0) ++aces;
      tot += values[numIndex];
      console.log(card, card[0], aces)
    }
    while (tot > 21 && aces > 0) {
      tot -= 10;
      --aces;
    }

    this.isBust = (tot > 21);
    this.isDone = this.isDone || this.isBust;

    console.log(tot, this.isBust, this.isDone)
    return tot;
  }

  end() {
    this.isDone = true;
  }

  stand() {
    this.isDone();
  }

  split() {
    this.hands = [...cards];
  }

  addCard(card) {
    this.cards.push(card);
    this.getTotal();
  }

  clearCards() {
    this.cards = 0;
    this.isDone = false;
    this.isBust = false;
  }
}

class Dealer extends Player{
  pot = 0;
  ;

  constructor(bet) {
    super(_dbuser);
    this.betSize = bet;
    this.pot = 0;
  }

  calculatePot(i) {
    this.pot = i * this.betSize;
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