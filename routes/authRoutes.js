const express = require("express");

const authController = require("../controllers/authController");
const {
  validateAuthPayload,
} = require("../middlewares/validation/validateAuthPayload");
const {
  validateRegisterPayload,
} = require("../middlewares/validation/validateRegisterPayload");
const { requireAuth } = require("../middlewares/auth/requireAuth");

const router = express.Router();

router.post("/register", validateRegisterPayload, authController.register);
router.post("/login", validateAuthPayload, authController.login);
router.get("/me", requireAuth, authController.me);

module.exports = router;
