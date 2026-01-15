const express = require("express");

const dashboardController = require("../controllers/dashboardController");
const { requireAuth } = require("../middlewares/auth/requireAuth");
const { requireAdmin } = require("../middlewares/auth/requireAdmin");

const router = express.Router();

router.use(requireAuth, requireAdmin);
router.get("/summary", dashboardController.summary);

module.exports = router;
