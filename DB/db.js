const { MongoClient, ServerApiVersion } = require('mongodb');
const { ip, port, dbname } = require('./db-settings.json');

const uri = `mongodb://${ip}:${port}/`;

const xpDelay = 30_000;
const xpDecay = 2; //doesn't do shit
const randomXpDelay = 5_500;
const xpRange = {
  min: 1,
  max: 5,
  bias: 5
}


const workingHours = 60_000 * 30;
const randomWorkDelay = 3;

const basePay = 1;
class mongodb {
  client;
  db;
  users;
  timers;
  effects;

  constructor() {
    try {
      this.client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });
    } finally {
      this.db = this.client.db(dbname);
      this.users = this.db.collection('users');
      this.timers = this.db.collection('timers');
      this.effects = this.db.collection('effects');
    }
  }

  async connect() {
    await this.client.connect();
    await this.db.command({ ping: 1 });
    return 0;
  }

  async disconnect() {
    await this.client.close();
    console.log("Disconnected!");
    return 0;
  }

  async getAllUsers() {
    return this.users.find({}).toArray();
  }

  async getAllTimers() {
    return this.timers.find({}).toArray();
  }

  async getAllEffects() {
    let effects = await this.effects.find({}).toArray();

    return effects.map((e) => new Effect(
      e.target, e.emoji, e.duration, e.createdAt, e._id
    ))
  }

  async insertTimer(timer) {
    if (!timer || timer == null) return;
    this.timers.insertOne(timer);
  }

  async deleteTimer(timer) {
    this.timers.deleteOne(timer._id);
    return;
  }

  async insertEffect(effect) {
    if (!effect || effect == null) return;
    this.effects.insertOne(effect);
  }

  async deleteEffect(effect) {
    this.effects.deleteOne(effect._id);
    return;
  }

  async getUserEffects(dbuser) {
    //TODO: REMOVE?
  }

  async findUser(userid) {
    let user = await this.users.findOne({ _id: userid });
    if (!user) throw "USER_NOT_FOUND";

    return new User(
      user._id,
      user.username,
      user.xp,
      user.lvl,
      user.currency,
      user.lastActivity,
      user.nextXp,
      user.nextPay,
      user.cajas,
      user.lichess,
      user.chesscom,
      user.isLichessVerified,
      user.isChesscomVerified,
      user.serverCurrency
    )

    return user;
  }

  async insertUser(user) {
    if (!user || user == null) return;
    if (this.findUser(user._id).catch(() => { console.log })) throw "USER_ALREADY_EXISTS";
    this.users.insertOne(user);
  }

  async updateUser(id, field, content) {
    if (!field || !id) throw "MISSING_FIELD_OR_ID";

    this.users.updateOne({ _id: id }, { $set: { [field]: content } })
  }

  async deleteUser(user) {
    findUser(user._id);
    this.users.deleteOne(user._id);
    return;
  }

  async transferCurrency(_alice, _bob, amount = 0) {
    if (_alice == _bob) throw "A_AND_B_ARE_EQUAL";
    console.log(`alice(${_alice}) is sending ` + amount + ` to bob(${_bob}).`)
    let alice = this.findUser(_alice);
    let bob = this.findUser(_bob);

    if (isNaN(amount)) throw "NAN";

    if (amount < 0) throw "NEGATIVE";

    if (!alice || !bob) throw "USER_NOT_FOUND";
    if (amount > alice.currency) throw "BROKE";

    amount = parseInt(amount);

    this.users.updateOne(
      { _id: _alice },
      { $inc: { currency: -amount } }
    );

    this.users.updateOne(
      { _id: _bob },
      { $inc: { currency: amount } }
    );

  }

  async addCurrency(_alice, amount = 1) {
    if (!_alice) throw "NO_TARGET";
    let alice = this.findUser(_alice);

    if (isNaN(amount)) throw "NAN";
    amount = parseInt(amount);

    if (alice.currency < -amount) amount = -alice.currency;

    this.users.updateOne(
      { _id: _alice },
      { $inc: { currency: amount } }
    );
  }

  async addBox(_alice, amount = 1) {
    if (!_alice) throw "NO_TARGET";
    let alice = this.findUser(_alice);

    if (isNaN(amount)) throw "NAN";
    amount = parseInt(amount);

    if (alice.cajas < -amount) throw "NO_BOXES"

    this.users.updateOne(
      { _id: _alice },
      { $inc: { cajas: amount } }
    );
  }
}

let db = new mongodb();

class User {
  _id;
  username;
  xp;
  lvl;
  currency;
  lastActivity;
  nextXp;
  nextPay;
  cajas;
  lichess;
  chesscom;
  isLichessVerified;
  isChesscomVerified;
  serverCurrency;

  constructor(
    _id,
    _username,
    _xp = 0,
    _lvl,
    _currency = 0,
    _lastActivity = Date.now(),
    _nextXp = Date.now(),
    _nextPay,
    _cajas = 1,
    _lichess = null,
    _chesscom = null,
    _isLichessVerified = false,
    _isChesscomVerified = false,
    _serverCurrency = null
  ) {
    this._id = _id;
    this.username = _username;

    this.xp = _xp;
    this.currency = _currency;
    this.lastActivity = _lastActivity;
    this.lvl = this.#calculateLvl();
    this.nextXp = _nextXp;
    this.nextPay = _nextPay;
    this.cajas = _cajas;
    this.lichess = _lichess;
    this.chesscom = _chesscom;
    this.isLichessVerified = _isLichessVerified;
    this.isChesscomVerified = _isChesscomVerified;
    this.serverCurrency = _serverCurrency;

  }

  //#checkXpTimer() {
  //    return this.lastActivity > this.nextXp;
  //}

  //#calculateXp() {
  //    let gain = ~~((((Math.random() ** xpRange.bias)) * xpRange.max ) + xpRange.min);

  //    //let adjustedGain = (gain - ~~(gain * ((this.xp / 10_000) ** xpDecay)));

  //    this.xp += gain;
  //}

  #calculateLvl(message, emoji) {
    if (this.lastActivity == -1) return 99;
    let lvl = Math.max(~~((Math.log(this.xp / 2) + 1) / Math.log(1.25)) + 1, 0);
    // if (lvl != this.lvl && message) message.react(emoji)
    return lvl;
  }

  //#updatenextXp() {
  //    this.nextXp = ( Date.now() + xpDelay + ~~((Math.random() * 2 - 1) * randomXpDelay));
  //    return;
  //}

  //updateXp() {
  //    if (this.lastActivity == -1) return 999;
  //    if(!this.#checkXpTimer()) return this.xp;

  //    this.#calculateXp();
  //    this.#updatenextXp();
  //    return this.xp;
  //}

  //updateLvl(message = null, emoji = null) {
  //    if (this.lastActivity == -1) return 99;
  //    this.#calculateLvl(message, emoji);
  //    return this.lvl;
  //}

  //#randomWorkDelay() {
  //    let delay = Math.random() * 1000 * 60 * randomWorkDelay;
  //    return ~~delay;
  //}

  //#checkPayTime() {
  //    return (this.lastActivity > this.nextPay);
  //}

  //#calculateIncome() {
  //    if (this.lastActivity == -1) return 999;
  //    this.nextPay = this.lastActivity + workingHours + this.#randomWorkDelay();
  //    let pay = this.pay();

  //    pay = pay < 0 ? 0 : pay;

  //    console.log(this.username, " is getting paid! ", pay);

  //    return pay;
  //}

  pay() {
    if (this.lastActivity == -1) return 999;
    return basePay + Math.floor(Math.min(this.currency, 5_000) / 250) + Math.floor(this.lvl / 10);
  }

  //async updateCurrency(discordmessage = null, reaction = "🧧") {
  //    if (this.lastActivity == -1) return this.currency;
  //    if (!this.#checkPayTime()) {
  //        return this.currency;
  //    }
  
  //    // if (discordmessage) discordmessage.react(reaction);
  //    this.currency += this.#calculateIncome();
  //    return this.currency;
  //}

  async getEffects() {
    let effects = await db.getAllEffects();
    return effects.filter(effect => effect.target == this._id);
  }
}

class Timer {
  _id;
  owner;
  channelId;
  createdAt;
  duration;
  message;
  handled = false;
  constructor(
    _owner,
    _channelId,
    _duration,
    _message = "Time's up!",
    id = undefined) {
      this._id = id;
      this.owner = _owner;
      this.channelId = _channelId;
      this.createdAt = Date.now();
      this.duration = _duration;
      this.message = _message.length < 1 ? "" : "\n" + _message;
  }

  isDone() {
    return (this.createdAt + this.duration * 1_000) < Date.now();
  }

  delete() {
    db.deleteTimer(this._id);
  }
}

class Effect {
  _id;
  target;
  emoji;
  duration;
  createdAt;
  constructor(
    _target,
    _emoji,
    _duration,
    _createdAt,
    id
  ) {
    this.target = _target;
    this.emoji = _emoji;
    this.duration = _duration;
    this.createdAt = _createdAt;
    this._id = id;
  }

  react(message) {
    if (!message) throw "NOT VALID MESSAGE";
    try {
      message.react(this.emoji)
    } catch (err) {
      console.log(err);
      throw "NOT VALID MESSAGE";
    }
  }

  async getTarget() {
    return await db.findUser(target);
  }

  checkTime() {
    return (this.duration * 1_000 + this.createdAt) < Date.now(); 
  }

  checkRemainingTime() {
    return ~~(((this.duration * 1_000 + this.createdAt) - Date.now()) / 1000)
  }
};

module.exports.mongoClient = db;
module.exports.dbUser = User;
module.exports.Timer = Timer;
module.exports.Effect = Effect;