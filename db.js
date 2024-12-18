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

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/wtwr_db";

async function connectToDatabase() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logger.info(`Connected to MongoDB at ${uri}`);
    return mongoose.connection;
  } catch (error) {
    logger.error("Error connecting to MongoDB using Mongoose:", error.message);

    process.exit(1);
  }
}

mongoose.connection.on("disconnected", () => {
  logger.warn("MongoDB connection closed");
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  logger.info("MongoDB connection closed due to application termination");
  process.exit(0);
});

module.exports = { connectToDatabase };
