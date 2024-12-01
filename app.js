const express = require("express");
const { connectToDatabase } = require("./db");
const routes = require("./routes");
const { ERROR_CODES } = require("./utils/errors");

const { PORT = 3001 } = process.env;

const app = express();

(async () => {
  try {
    await connectToDatabase();
    console.log("Connected to the database");

    app.use(express.json());

    app.use((req, res, next) => {
      req.user = { _id: "60df3b78c2d7b814c8b5369a" };
      next();
    });

    app.use(routes);

    app.use((req, res) => {
      res
        .status(ERROR_CODES.NOT_FOUND)
        .send({ message: "Requested resource not found" });
    });

    app.use((err, req, res) => {
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
