require("dotenv").config();
const express = require("express");
const cors = require("cors");
const winston = require("winston");
const { connectToDatabase } = require("./db");
const routes = require("./routes");
const { ERROR_CODES } = require("./utils/errors");

const { PORT = 3001 } = process.env;

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [new winston.transports.Console()],
});

const app = express();

(async () => {
  try {
    await connectToDatabase();
    logger.info("Connected to the database");

    app.use(express.json());
    app.use(cors());
    app.use(routes);

    app.use((req, res) => {
      res
        .status(ERROR_CODES.NOT_FOUND)
        .send({ message: "Requested resource not found" });
    });

    app.use((err, req, res, next) => {
      const {
        statusCode = ERROR_CODES.SERVER_ERROR,
        message = "An error occurred on the server",
      } = err;
      logger.error(`Error: ${message}, Status Code: ${statusCode}`);
      res.status(statusCode).send({ message });
    });

    app.listen(PORT, () => {
      logger.info(`App is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
})();
