require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { errors } = require("celebrate");

const { connectToDatabase } = require("./db");
const routes = require("./routes");
const { NotFoundError, ERROR_CODES } = require("./utils/errors");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const { PORT = 3001 } = process.env;

const app = express();

connectToDatabase();

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use(express.json());
app.use(cors());

app.use(requestLogger);

app.use(routes);

app.use(errorLogger);

app.use(errors());

app.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

app.use((err, req, res, _next) => {
  const {
    statusCode = ERROR_CODES.SERVER_ERROR,
    message = "An error occurred on the server",
  } = err;
  res.status(statusCode).send({ message });
});

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
