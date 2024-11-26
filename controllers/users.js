const User = require("../models/user");
const { ERROR_CODES } = require("../utils/errors");

module.exports.getUsers = (req, res) => {
  User.find()
    .then((users) => res.send(users))
    .catch(() => {
      res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: "An error occurred on the server" });
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      const error = new Error("User not found");
      error.statusCode = ERROR_CODES.NOT_FOUND;
      throw error;
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "CastError") {
        res
          .status(ERROR_CODES.BAD_REQUEST)
          .send({ message: "Invalid user ID passed" });
      } else if (err.statusCode === ERROR_CODES.NOT_FOUND) {
        res.status(ERROR_CODES.NOT_FOUND).send({ message: err.message });
      } else {
        res
          .status(ERROR_CODES.SERVER_ERROR)
          .send({ message: "An error occurred on the server" });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(ERROR_CODES.BAD_REQUEST)
          .send({ message: "Invalid data passed to create user" });
      } else {
        res
          .status(ERROR_CODES.SERVER_ERROR)
          .send({ message: "An error occurred on the server" });
      }
    });
};
