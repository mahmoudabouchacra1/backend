const postsService = require("../services/postsService");

async function listPosts(req, res) {
  try {
    const rows = await postsService.listPosts();
    res.json({ data: rows });
  } catch (error) {
    res.status(500).json({ message: "database error" });
  }
}

async function createPost(req, res) {
  try {
    const newPost = await postsService.createPost(req.body);
    res.status(201).json({ message: "created successfully", data: newPost });
  } catch (error) {
    res.status(500).json({ message: "database error" });
  }
}

async function deletePost(req, res) {
  const id = req.validatedId;

  try {
    const affectedRows = await postsService.deletePost(id);

    if (affectedRows === 0) {
      return res.status(404).json({ message: "not found" });
    }

    res.json({ message: "deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "database error" });
  }
}

module.exports = {
  listPosts,
  createPost,
  deletePost,
};
