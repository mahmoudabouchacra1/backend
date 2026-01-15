const express = require("express");

const vendorsController = require("../controllers/vendorsController");
const { requireAuth } = require("../middlewares/auth/requireAuth");
const { validateIdParam } = require("../middlewares/validation/validateIdParam");

const router = express.Router();

router.use(requireAuth);
router.get("/", vendorsController.list);
router.get("/:id", validateIdParam, vendorsController.getById);
router.post("/", vendorsController.create);
router.put("/:id", validateIdParam, vendorsController.update);
router.delete("/:id", validateIdParam, vendorsController.remove);

module.exports = router;
