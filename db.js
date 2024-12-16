const mongoose = require("mongoose");
const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [new winston.transports.Console()],
});

const uri = "mongodb://127.0.0.1:27017/wtwr_db";

async function connectToDatabase() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info("Connected to MongoDB locally using Mongoose!");
    return mongoose.connection;
  } catch (error) {
    logger.error("Error connecting to MongoDB using Mongoose:", error);
    throw error;
  }
}

module.exports = { connectToDatabase };
