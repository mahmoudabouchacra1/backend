const express = require("express");

const authController = require("../controllers/authController");
const {
  validateAuthPayload,
} = require("../middlewares/validation/validateAuthPayload");
const {
  validateRegisterPayload,
} = require("../middlewares/validation/validateRegisterPayload");

const router = express.Router();

router.post("/register", validateRegisterPayload, authController.register);
router.post("/login", validateAuthPayload, authController.login);

module.exports = router;
