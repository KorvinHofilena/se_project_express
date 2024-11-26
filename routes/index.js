const express = require("express");
const userRoutes = require("./users");
const clothingRoutes = require("./clothingItems");

const router = express.Router();

router.use("/users", userRoutes);
router.use("/items", clothingRoutes);

module.exports = router;
