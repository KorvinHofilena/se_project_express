const { celebrate, Joi } = require("celebrate");

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

module.exports = {
  validateSignup,
  validateSignin,
};
