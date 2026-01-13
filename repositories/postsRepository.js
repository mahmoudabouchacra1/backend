const prisma = require("../server/prisma");

async function getAllPosts() {
  return prisma.post.findMany({
    select: {
      id: true,
      title: true,
      body: true,
    },
    orderBy: {
      id: "desc",
    },
  });
}

async function createPost(title, body) {
  const post = await prisma.post.create({
    data: {
      title,
      body,
    },
    select: {
      id: true,
    },
  });
  return post.id;
}

async function deletePostById(id) {
  const result = await prisma.post.deleteMany({
    where: { id },
  });
  return result.count;
}

module.exports = {
  getAllPosts,
  createPost,
  deletePostById,
};
