const express = require("express");

const authRoutes = require("./authRoutes");
const merchantsRoutes = require("./merchantsRoutes");
const postsRoutes = require("./postsRoutes");
const vendorsRoutes = require("./vendorsRoutes");
const usersRoutes = require("./usersRoutes");
const countriesRoutes = require("./countriesRoutes");
const dashboardRoutes = require("./dashboardRoutes");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ status: "ok", message: "test succcessfully" });
});

router.use("/posts", postsRoutes);
router.use("/auth", authRoutes);
router.use("/merchants", merchantsRoutes);
router.use("/vendors", vendorsRoutes);
router.use("/users", usersRoutes);
router.use("/countries", countriesRoutes);
router.use("/dashboard", dashboardRoutes);

module.exports = router;
