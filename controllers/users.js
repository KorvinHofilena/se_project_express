const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { ERROR_CODES } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

module.exports.getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return res
          .status(ERROR_CODES.NOT_FOUND)
          .send({ message: "User not found" });
      }
      res.send(user);
    })
    .catch(() =>
      res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: "An error occurred on the server" })
    );
};

module.exports.createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) =>
      res
        .status(201)
        .send({ name: user.name, avatar: user.avatar, email: user.email })
    )
    .catch((err) => {
      if (err.code === 11000) {
        res
          .status(ERROR_CODES.CONFLICT)
          .send({ message: "Email already exists" });
      } else if (err.name === "ValidationError") {
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

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: "Email and password must be provided" });
  }

  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Incorrect email or password"));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Incorrect email or password"));
        }
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });
        res.send({ token });
      });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        res.status(ERROR_CODES.UNAUTHORIZED).send({ message: err.message });
      } else {
        res
          .status(ERROR_CODES.SERVER_ERROR)
          .send({ message: "An error occurred on the server" });
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return res
          .status(ERROR_CODES.NOT_FOUND)
          .send({ message: "User not found" });
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(ERROR_CODES.BAD_REQUEST)
          .send({ message: "Invalid data passed to update user" });
      } else {
        res
          .status(ERROR_CODES.SERVER_ERROR)
          .send({ message: "An error occurred on the server" });
      }
    });
};
