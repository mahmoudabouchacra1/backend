const postsRepository = require("../repositories/postsRepository");

async function listPosts() {
  return postsRepository.getAllPosts();
}

async function createPost(payload) {
  const { title, body } = payload || {};
  const safeTitle = title?.trim() || "Untitled";
  const safeBody = body?.trim() || "";

  const insertId = await postsRepository.createPost(safeTitle, safeBody);

  return {
    id: insertId,
    title: safeTitle,
    body: safeBody,
  };
}

async function deletePost(id) {
  return postsRepository.deletePostById(id);
}

module.exports = {
  listPosts,
  createPost,
  deletePost,
};
