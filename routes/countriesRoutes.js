const express = require("express");

const countriesController = require("../controllers/countriesController");
const { validateIdParam } = require("../middlewares/validation/validateIdParam");

const router = express.Router();

router.get("/", countriesController.list);
router.get("/:id", validateIdParam, countriesController.getById);
router.post("/", countriesController.create);
router.put("/:id", validateIdParam, countriesController.update);
router.delete("/:id", validateIdParam, countriesController.remove);

module.exports = router;
