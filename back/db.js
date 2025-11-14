const { MongoClient } = require("mongodb");
require('dotenv').config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(process.env.MONGO_URI);
const dbName = process.env.DB_NAME;

async function connectDB() {
    await client.connect()
    return client.db(dbName);
}

async function testConnection() {
    MongoClient.connect(uri)
        .then((client) => {
            console.log("Connected to Database");
        })
        .catch((error) => console.error(error));
}

module.exports = {
    connectDB,
    testConnection,
};