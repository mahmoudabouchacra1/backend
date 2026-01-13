const prisma = require("../server/prisma");

async function createUser(email, passwordHash) {
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
    },
  });
  return user.id;
}

async function findUserByEmail(email) {
  return prisma.user.findUnique({
    where: { email },
  });
}

module.exports = {
  createUser,
  findUserByEmail,
};
