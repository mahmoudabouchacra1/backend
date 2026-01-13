const express = require("express");

const authRoutes = require("./authRoutes");
const postsRoutes = require("./postsRoutes");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ status: "ok", message: "test succcessfully" });
});

router.use("/posts", postsRoutes);
router.use("/auth", authRoutes);

module.exports = router;