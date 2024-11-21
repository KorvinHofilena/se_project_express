const User = require("../models/user");

module.exports.getUsers = (req, res) => {
  User.find()
    .then((users) => res.send(users))
    .catch((err) =>
      res.status(500).send({ message: "An error occurred on the server" })
    );
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else {
        res.status(500).send({ message: "An error occurred on the server" });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: "Invalid data passed to create user" });
      } else {
        res.status(500).send({ message: "An error occurred on the server" });
      }
    });
};
