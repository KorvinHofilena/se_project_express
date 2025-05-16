const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  BadRequestError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
  InternalServerError,
} = require("../utils/errors");

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) throw new NotFoundError("User not found");
      res.send(user);
    })
    .catch((_err) => next(new InternalServerError()));
};

module.exports.createUser = (req, res, next) => {
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
      if (err.code === 11000)
        return next(new ConflictError("Email already exists"));
      if (err.name === "ValidationError")
        return next(new BadRequestError("Invalid data"));
      return next(new InternalServerError());
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new BadRequestError("Email and password required"));

  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) throw new UnauthorizedError("Incorrect email or password");
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched)
          throw new UnauthorizedError("Incorrect email or password");
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });
        res.send({ token });
      });
    })
    .catch((err) => {
      if (err instanceof UnauthorizedError) return next(err);
      return next(new InternalServerError());
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) throw new NotFoundError("User not found");
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError")
        return next(new BadRequestError("Invalid data"));
      return next(new InternalServerError());
    });
};
