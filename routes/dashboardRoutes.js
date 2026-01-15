const express = require("express");

const dashboardController = require("../controllers/dashboardController");
const { requireAuth } = require("../middlewares/auth/requireAuth");

const router = express.Router();

router.use(requireAuth);
router.get("/summary", dashboardController.summary);

module.exports = router;
