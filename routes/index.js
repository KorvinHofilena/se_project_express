const express = require("express");
const { celebrate, Joi } = require("celebrate");

const userRoutes = require("./users");
const clothingRoutes = require("./clothingItems");

const { createUser, login } = require("../controllers/users");
const auth = require("../middlewares/auth");

const router = express.Router();

const validateSignup = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    avatar: Joi.string().uri().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const validateSignin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

router.get("/", (req, res) => {
  res.send({ message: "Welcome to my API!" });
});

router.post("/signup", validateSignup, createUser);
router.post("/signin", validateSignin, login);

router.use("/users", auth, userRoutes);
router.use("/items", clothingRoutes);

module.exports = router;
