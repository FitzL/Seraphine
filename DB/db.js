const { MongoClient, ServerApiVersion } = require('mongodb');
const { ip, port, dbname } = require('./db-settings.json');

const uri = `mongodb://${ip}:${port}/`;

const xpDelay = 30_000;
const xpDecay = 2;
const randomXpDelay = 5_500;
const xpRange = {
    min: 2,
    max: 4,
    bias: 5
}


const workingHours = 60_000 * 30;
const randomWorkDelay = 3;

const basePay = 3;
const payVariance = 2;

class User{
    _id;
    username;
    xp;
    lvl;
    currency;
    lastActivity;
    nextXp;
    nextPay;
    cajas;

    constructor(_id, _username, _xp = 0, _lvl, _currency = 0, _lastActivity = Date.now(), _nextXp = Date.now(), _nextPay, _cajas = 1) {
        this._id = _id;
        this.username = _username;

        this.xp = _xp;
        this.currency = _currency;
        this.lvl = this.#calculateLvl();
        this.lastActivity = _lastActivity;
        this.nextXp = _nextXp;
        this.nextPay = _nextPay;
        this.cajas = _cajas;
    }

    #calculateLvl(message, emoji) {
        let lvl = ~~(((Math.log(this.xp / 2) + 1) / Math.log(1.5)) / 2) + 1;
        // if (lvl != this.lvl && message) message.react(emoji)
        return lvl;
    }

    #checkXpTimer() {
        return this.lastActivity > this.nextXp;
    }

    #calculateXp() {
        let gain = ~~((((Math.random() ** xpRange.bias)) * xpRange.max ) + xpRange.min);

        let adjustedGain = (gain - ~~(gain * ((this.xp / 2_000) ** xpDecay)));

        this.xp += adjustedGain;
    }

    #updatenextXp() {
        this.nextXp = ( Date.now() + xpDelay + ~~((Math.random() * 2 - 1) * randomXpDelay));
        return;
    }

    updateXp() {
        if(!this.#checkXpTimer()) return this.xp;

        this.#calculateXp();
        this.#updatenextXp();
        return this.xp;
    }

    updateLvl(message = null, emoji = null) {
        this.#calculateLvl(message, emoji);
        return this.lvl;
    }

    #randomWorkDelay() {
        let delay = Math.random() * 1000 * 60 * randomWorkDelay;
        return ~~delay;
    }

    #checkPayTime() {
        return (this.lastActivity > this.nextPay);
    }

    #calculateIncome() {
        this.nextPay = this.lastActivity + workingHours + this.#randomWorkDelay();
        let pay = basePay + this.lvl - Math.floor(this.currency / 50);
        let randomVariance = (Math.random() - .5) * payVariance * 2

        pay -= Math.floor(randomVariance);

        pay = pay < 0 ? 0 : pay;

        console.log(this.username, " is getting paid! ", pay);

        return pay;
    }

    async updateCurrency(discordmessage = null, reaction = "🧧") {
        if (!this.#checkPayTime()) {
            return this.currency;
        }

        // if (discordmessage) discordmessage.react(reaction);
        this.currency += this.#calculateIncome(); 
        return this.currency;
    }
}

class mongodb {
    client;
    db;
    users;

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

    async findUser(userid) {
        let user = await this.users.findOne({ _id: userid });
        if (!user) throw "user not found";
        return user;
    }

    async insertUser (user) {
        if (!user || user == null) return;
        if (await this.findUser(user._id).catch(() => { console.log })) throw "user already exists";
        await this.users.insertOne(user);
    }

    async updateUser (id, field, content) {
        if (!field || !id) throw "missing field or id";

        await this.users.updateOne({_id: id}, {$set: {[field]: content}})
    }

    async deleteUser(user) {
        findUser(user._id);
        this.users.deleteOne(user._id);
        return;
    }

    async transferCurrency(_alice, _bob, amount = 0) {
        if (_alice == _bob) throw "A_AND_B_ARE_EQUAL";
        console.log(`alice(${_alice}) is sending ` + amount + ` to bob(${_bob}).`)
        let alice = await this.findUser(_alice);
        let bob = await this.findUser(_bob);

        if (isNaN(amount)) throw "NAN";

        if (amount < 1) throw "NEGATIVE";

        if (!alice || !bob) throw "USER_NOT_FOUND";
        if (amount > alice.currency) throw "BROKE";

        amount = parseInt(amount);

        alice.currency -= amount; await this.updateUser(alice._id, "currency", alice.currency);
        bob.currency += amount; await this.updateUser(bob._id, "currency", bob.currency);
    }

    async addCurrency(_alice, amount = 1) {
        if (!_alice) throw "NO_TARGET";
        let alice = await this.findUser(_alice);

        if (isNaN(amount)) throw "NAN";
        amount = parseInt(amount);

        if (alice.currency < -amount) throw "BROKE"

        alice.currency += amount; await this.updateUser(alice._id, "currency", alice.currency);
    }

    async addBox(_alice, amount = 1) {
        if (!_alice) throw "NO_TARGET";
        let alice = await this.findUser(_alice);

        if (isNaN(amount)) throw "NAN";
        amount = parseInt(amount);

        if (alice.cajas < -amount) throw "NO_BOXES"

        alice.cajas += amount; await this.updateUser(alice._id, "cajas", alice.cajas);
    }
}

let db = new mongodb();

module.exports.mongoClient = db;
module.exports.dbUser = User;