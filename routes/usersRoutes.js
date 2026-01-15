const express = require("express");

const usersController = require("../controllers/usersController");
const { requireAuth } = require("../middlewares/auth/requireAuth");
const { requireAdmin } = require("../middlewares/auth/requireAdmin");
const { validateIdParam } = require("../middlewares/validation/validateIdParam");

const router = express.Router();

router.use(requireAuth, requireAdmin);
router.get("/", usersController.list);
router.get("/:id", validateIdParam, usersController.getById);
router.post("/", usersController.create);
router.put("/:id", validateIdParam, usersController.update);
router.delete("/:id", validateIdParam, usersController.remove);

module.exports = router;
