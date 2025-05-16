const ClothingItem = require("../models/clothingItem");
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  InternalServerError,
} = require("../utils/errors");

module.exports.getClothingItems = (req, res, next) => {
  ClothingItem.find()
    .then((items) => res.send(items))
    .catch(() => next(new InternalServerError("Failed to fetch items")));
};

module.exports.createClothingItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data passed to create item"));
      }
      next(new InternalServerError());
    });
};

module.exports.deleteClothingItem = (req, res, next) => {
  ClothingItem.findById(req.params.itemId)
    .orFail(() => new NotFoundError("Item not found"))
    .then((item) => {
      if (!item.owner.equals(req.user._id)) {
        throw new ForbiddenError(
          "You do not have permission to delete this item"
        );
      }
      return item.deleteOne();
    })
    .then(() => res.send({ message: "Item deleted successfully" }))
    .catch((err) => {
      if (err.name === "CastError")
        return next(new BadRequestError("Invalid item ID passed"));
      next(err);
    });
};

module.exports.likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new NotFoundError("Item not found"))
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.name === "CastError")
        return next(new BadRequestError("Invalid item ID passed"));
      next(err);
    });
};

module.exports.dislikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new NotFoundError("Item not found"))
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.name === "CastError")
        return next(new BadRequestError("Invalid item ID passed"));
      next(err);
    });
};
