const prisma = require("../server/prisma");

const userSelect = {
  id: true,
  merchantId: true,
  vendorId: true,
  userType: true,
  fullName: true,
  email: true,
  phone: true,
  avatar: true,
  isEmailVerified: true,
  lastLoginAt: true,
  isActive: true,
  createdAt: true,
  createdBy: true,
  updatedAt: true,
  updatedBy: true,
  merchant: true,
  vendor: true,
};

async function createUser(data) {
  return prisma.user.create({ data, select: userSelect });
}

async function listUsers() {
  return prisma.user.findMany({
    select: userSelect,
    orderBy: { createdAt: "desc" },
  });
}

async function getUserById(id) {
  return prisma.user.findUnique({
    where: { id },
    select: userSelect,
  });
}

async function updateUser(id, data) {
  return prisma.user.update({ where: { id }, data, select: userSelect });
}

async function deleteUser(id) {
  return prisma.user.delete({ where: { id } });
}

async function findUserByEmail(email) {
  return prisma.user.findFirst({ where: { email } });
}

module.exports = {
  createUser,
  listUsers,
  getUserById,
  updateUser,
  deleteUser,
  findUserByEmail,
};
