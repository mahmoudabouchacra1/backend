const express = require("express");

const postsController = require("../controllers/postsController");
const { validateIdParam } = require("../middlewares/validation/validateIdParam");
const { validatePostPayload } = require("../middlewares/validation/validatePostPayload");

const router = express.Router();

router.get("/", postsController.listPosts);
router.post("/", validatePostPayload, postsController.createPost);
router.delete("/:id", validateIdParam, postsController.deletePost);

module.exports = router;