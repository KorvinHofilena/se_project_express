require("dotenv").config();
const express = require("express");
const cors = require("cors");
const winston = require("winston");
const { errors } = require("celebrate");
const morgan = require("morgan");

const { connectToDatabase } = require("./db");
const routes = require("./routes");
const {
  NotFoundError,
  ERROR_CODES,
  InternalServerError,
} = require("./utils/errors");

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

connectToDatabase();

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use(express.json());
app.use(cors());

app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

app.use(routes);

app.use(errors());

app.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
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
