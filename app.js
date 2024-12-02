const express = require("express");
const cors = require("cors");
const { connectToDatabase } = require("./db");
const routes = require("./routes");
const { ERROR_CODES } = require("./utils/errors");
const auth = require("./middlewares/auth");

const { PORT = 3001 } = process.env;

const app = express();

(async () => {
  try {
    await connectToDatabase();
    console.log("Connected to the database");

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
      res.status(statusCode).send({ message });
    });

    app.listen(PORT, () => {
      console.log(`App is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();
