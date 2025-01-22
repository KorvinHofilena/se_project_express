require("dotenv").config();
const mongoose = require("mongoose");
const winston = require("winston");

mongoose.set("strictQuery", true);

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [new winston.transports.Console()],
});

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/default_db";

function connectToDatabase() {
  mongoose
    .connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      logger.info(`Connected to MongoDB at ${uri}`);
    })
    .catch((error) => {
      logger.error("Error connecting to MongoDB:", error.message);
      process.exit(1);
    });

  mongoose.connection.on("disconnected", () => {
    logger.warn("MongoDB connection closed");
  });

  process.on("SIGINT", () => {
    mongoose.connection.close().then(() => {
      logger.info("MongoDB connection closed due to application termination");
      process.exit(0);
    });
  });

  return mongoose.connection;
}

module.exports = { connectToDatabase };
