const express = require("express");
const { celebrate, Joi } = require("celebrate");

const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

const auth = require("../middlewares/auth");

const router = express.Router();

const validateItemId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().hex().length(24).required(),
  }),
});

const validateCreateItem = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    weather: Joi.string().valid("hot", "warm", "cold").required(),
    imageUrl: Joi.string().uri().required(),
  }),
});

router.get("/", getClothingItems);

router.post("/", auth, validateCreateItem, createClothingItem);

router.delete("/:itemId", auth, validateItemId, deleteClothingItem);

router.put("/:itemId/likes", auth, validateItemId, likeItem);

router.delete("/:itemId/likes", auth, validateItemId, dislikeItem);

module.exports = router;
