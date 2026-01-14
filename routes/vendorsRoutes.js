const express = require("express");

const vendorsController = require("../controllers/vendorsController");
const { validateIdParam } = require("../middlewares/validation/validateIdParam");

const router = express.Router();

router.get("/", vendorsController.list);
router.get("/:id", validateIdParam, vendorsController.getById);
router.post("/", vendorsController.create);
router.put("/:id", validateIdParam, vendorsController.update);
router.delete("/:id", validateIdParam, vendorsController.remove);

module.exports = router;
