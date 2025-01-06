const express = require("express");
const userRoutes = require("./users");
const clothingRoutes = require("./clothingItems");
const { createUser, login } = require("../controllers/users");
const auth = require("../middlewares/auth");

const router = express.Router();

router.get("/", (req, res) => {
  res.send({ message: "Welcome to my API!" });
});

router.post("/signup", createUser);
router.post("/signin", login);

router.use("/users", auth, userRoutes);

router.use("/items", clothingRoutes);

module.exports = router;
