const express = require("express");

const merchantsController = require("../controllers/merchantsController");
const { validateIdParam } = require("../middlewares/validation/validateIdParam");

const router = express.Router();

router.get("/", merchantsController.list);
router.get("/:id", validateIdParam, merchantsController.getById);
router.post("/", merchantsController.create);
router.put("/:id", validateIdParam, merchantsController.update);
router.delete("/:id", validateIdParam, merchantsController.remove);

module.exports = router;
