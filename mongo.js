const { MongoClient, ServerApiVersion }= require('mongodb');
const uri = "mongodb://localhost:27017/";
const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    }
)

console.log("started");


async function run () {
    try {
        await client.connect();

        await client.db("nina").command({ ping: 1 });

        console.log("Connected!")
    }
    finally {
        await client.close();
    }
}

run().catch(console.dir);