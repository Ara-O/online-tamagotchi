require('dotenv').config()
const { MongoClient } = require("mongodb");

let db = null, client = null

export async function startDatabase() {
    let connectionString = `mongodb+srv://ara:${process.env.MONGO_PASSWORD}@tama.f3kgkua.mongodb.net/?retryWrites=true&w=majority`

    try {
        client = new MongoClient(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10
        });

        await client.connect()

        console.log("Connected to Mongo")

        db = client.db("tama")
    } catch (err) {
        console.error("Error connecting to mongo", err)
    }
}

export async function closeDatabase() {
    try {
        client.close()
    } catch (err) {
        console.log(err)
    }
}

export function getDatabaseConnection() {
    return db
}