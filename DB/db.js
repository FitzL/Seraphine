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
        this.lastActivity = _lastActivity;
        this.lvl = this.#calculateLvl();
        this.nextXp = _nextXp;
        this.nextPay = _nextPay;
        this.cajas = _cajas;
    }

    #checkXpTimer() {
        return this.lastActivity > this.nextXp;
    }

    #calculateXp() {
        let gain = ~~((((Math.random() ** xpRange.bias)) * xpRange.max ) + xpRange.min);

        //let adjustedGain = (gain - ~~(gain * ((this.xp / 10_000) ** xpDecay)));

        this.xp += gain;
    }

    #calculateLvl(message, emoji) {
        if (this.lastActivity == -1) return 99;
        let lvl = ~~(((Math.log(this.xp / 2) + 1) / Math.log(1.5))) + 1;
        // if (lvl != this.lvl && message) message.react(emoji)
        return lvl;
    }

    #updatenextXp() {
        this.nextXp = ( Date.now() + xpDelay + ~~((Math.random() * 2 - 1) * randomXpDelay));
        return;
    }

    updateXp() {
        if (this.lastActivity == -1) return 999;
        if(!this.#checkXpTimer()) return this.xp;

        this.#calculateXp();
        this.#updatenextXp();
        return this.xp;
    }

    updateLvl(message = null, emoji = null) {
        if (this.lastActivity == -1) return 99;
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
        if (this.lastActivity == -1) return 999;
        this.nextPay = this.lastActivity + workingHours + this.#randomWorkDelay();
        let pay = this.pay();

        pay = pay < 0 ? 0 : pay;

        console.log(this.username, " is getting paid! ", pay);

        return pay;
    }

    pay() {
        if (this.lastActivity == -1) return 999;
        return basePay + Math.floor(Math.min(this.currency, 5_000) / 250) + Math.floor(this.lvl/10);
    }

    async updateCurrency(discordmessage = null, reaction = "🧧") {
        if (this.lastActivity == -1) return this.currency;
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
        if (!user) throw "USER_NOT_FOUND";
        return user;
    }

    async insertUser (user) {
        if (!user || user == null) return;
        if (await this.findUser(user._id).catch(() => { console.log })) throw "USER_ALREADY_EXISTS";
        await this.users.insertOne(user);
    }

    async updateUser (id, field, content) {
        if (!field || !id) throw "MISSING_FIELD_OR_ID";

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

        if (alice.currency < -amount) amount = -alice.currency;

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