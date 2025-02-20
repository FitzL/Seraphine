const { MongoClient, ServerApiVersion } = require('mongodb');
const { ip, port, dbname } = require('./db-settings.json');

const uri = `mongodb://${ip}:${port}/`;

class User {
    _id;
    username;
    xp;
    lvl;
    currency;
    lastActivity;

    constructor(_id, _username) {
        this.id = _id;
        this.username = _username;

        this.xp = 0;
        this.lvl = 0;
        this.currency = 0;
        this.lastActivity = Date.now();
    }

    #calculateLvl() {
        return this.xp / 10;
    }

    updateLvl() {
        this.lvl = this.#calculateLvl();
    }

    updateActivity() {
        this.lastActivity = Date.now();
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
        console.log("Connected!");
    }

    async disconnect() {
        await this.client.close();
        console.log("Disconnected!");
    }

    async getAllUsers() {
        return this.users.find({}).toArray();
    }

    async addUser (user) {
        if (!user || user == null) return;
        if (await this.findUser(user.id)) return console.error("user already exists");
        await this.users.insertOne(user);
    }

    async findUser(userid) {
        return this.users.findOne({ id: userid });
    }

    async deleteUser(user) {
        if (user)
    }
}

let db = new mongodb();

let test = new User(1, 'fitz');

async function main() {

    await db.connect();

    await db.addUser(test);

    console.log(await db.getAllUsers());

    await db.disconnect();
}

main();

module.exports.mongoClient = db;
module.exports.dbUser = User;