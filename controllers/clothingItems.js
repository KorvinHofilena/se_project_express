const ClothingItem = require("../models/clothingItem");
const { ERROR_CODES } = require("../utils/errors");

module.exports.getClothingItems = (req, res) => {
  ClothingItem.find()
    .then((items) => res.send(items))
    .catch(() =>
      res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: "An error occurred on the server" })
    );
};

module.exports.createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(ERROR_CODES.BAD_REQUEST)
          .send({ message: "Invalid data passed to create item" });
      } else {
        res
          .status(ERROR_CODES.SERVER_ERROR)
          .send({ message: "An error occurred on the server" });
      }
    });
};

module.exports.deleteClothingItem = (req, res) => {
  ClothingItem.findById(req.params.itemId)
    .orFail(() => {
      const error = new Error("Item not found");
      error.statusCode = ERROR_CODES.NOT_FOUND;
      throw error;
    })
    .then((item) => {
      if (!item.owner.equals(req.user._id)) {
        const error = new Error(
          "You do not have permission to delete this item"
        );
        error.statusCode = ERROR_CODES.FORBIDDEN;
        throw error;
      }
      return item.deleteOne();
    })
    .then(() => res.send({ message: "Item deleted successfully" }))
    .catch((err) => {
      if (err.name === "CastError") {
        res
          .status(ERROR_CODES.BAD_REQUEST)
          .send({ message: "Invalid item ID passed" });
      } else if (err.statusCode === ERROR_CODES.NOT_FOUND) {
        res.status(ERROR_CODES.NOT_FOUND).send({ message: err.message });
      } else if (err.statusCode === ERROR_CODES.FORBIDDEN) {
        res.status(ERROR_CODES.FORBIDDEN).send({ message: err.message });
      } else {
        res
          .status(ERROR_CODES.SERVER_ERROR)
          .send({ message: "An error occurred on the server" });
      }
    });
};

module.exports.likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error("Item not found");
      error.statusCode = ERROR_CODES.NOT_FOUND;
      throw error;
    })
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.name === "CastError") {
        res
          .status(ERROR_CODES.BAD_REQUEST)
          .send({ message: "Invalid item ID passed" });
      } else if (err.statusCode === ERROR_CODES.NOT_FOUND) {
        res.status(ERROR_CODES.NOT_FOUND).send({ message: err.message });
      } else {
        res
          .status(ERROR_CODES.SERVER_ERROR)
          .send({ message: "An error occurred on the server" });
      }
    });
};

module.exports.dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error("Item not found");
      error.statusCode = ERROR_CODES.NOT_FOUND;
      throw error;
    })
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.name === "CastError") {
        res
          .status(ERROR_CODES.BAD_REQUEST)
          .send({ message: "Invalid item ID passed" });
      } else if (err.statusCode === ERROR_CODES.NOT_FOUND) {
        res.status(ERROR_CODES.NOT_FOUND).send({ message: err.message });
      } else {
        res
          .status(ERROR_CODES.SERVER_ERROR)
          .send({ message: "An error occurred on the server" });
      }
    });
};
