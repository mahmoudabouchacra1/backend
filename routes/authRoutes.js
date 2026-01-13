const express = require("express");

const authController = require("../controllers/authController");
const { validateAuthPayload } = require("../middlewares/validation/validateAuthPayload");

const router = express.Router();

router.post("/register", validateAuthPayload, authController.register);
router.post("/login", validateAuthPayload, authController.login);

module.exports = router;