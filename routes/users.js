const express = require("express");
const { celebrate, Joi } = require("celebrate");

const { getCurrentUser, updateUser } = require("../controllers/users");

const router = express.Router();

const validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    avatar: Joi.string().uri().required(),
  }),
});

router.get("/me", getCurrentUser);
router.patch("/me", validateUpdateUser, updateUser);

module.exports = router;
