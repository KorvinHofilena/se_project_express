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

const uri =
  "mongodb+srv://hofilenakorvin:<hofilenakorvin>@cluster0.lo8fk.mongodb.net/myDatabaseName?retryWrites=true&w=majority";

async function connectToDatabase() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info("Connected to MongoDB Atlas!");
    return mongoose.connection;
  } catch (error) {
    logger.error("Error connecting to MongoDB Atlas:", error.message);
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
