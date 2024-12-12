const { MongoClient } = require("mongodb");
const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [new winston.transports.Console()],
});

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

async function connectToDatabase() {
  try {
    await client.connect();
    logger.info("Connected to MongoDB locally!");
    return client;
  } catch (error) {
    logger.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

module.exports = { connectToDatabase, client };
