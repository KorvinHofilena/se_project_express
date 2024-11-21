const express = require("express");
const mongoose = require("mongoose");

const { PORT = 3001 } = process.env;

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
