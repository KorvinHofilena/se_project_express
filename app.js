const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/users");
const clothingRoutes = require("./routes/clothingItems");

const { PORT = 3001 } = process.env;

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());

app.use((req, res, next) => {
  req.user = { _id: "60df3b78c2d7b814c8b5369a" };
  next();
});

app.use("/users", userRoutes);
app.use("/items", clothingRoutes);

app.use((req, res) => {
  res.status(404).send({ message: "Requested resource not found" });
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "An error occurred on the server" } = err;
  res.status(statusCode).send({ message });
});

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
