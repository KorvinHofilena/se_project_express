const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://hofilenakorvin:HnGbkzYSjs5kBoJh@cluster0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
    return client;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

module.exports = { connectToDatabase, client };
