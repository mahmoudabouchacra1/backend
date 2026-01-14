const prisma = require("../server/prisma");

async function listMerchants() {
  return prisma.merchant.findMany({
    include: { country: true },
    orderBy: { createdAt: "desc" },
  });
}

async function getMerchantById(id) {
  return prisma.merchant.findUnique({
    where: { id },
    include: { country: true },
  });
}

async function createMerchant(data) {
  return prisma.merchant.create({ data });
}

async function updateMerchant(id, data) {
  return prisma.merchant.update({ where: { id }, data });
}

async function deleteMerchant(id) {
  return prisma.merchant.delete({ where: { id } });
}

module.exports = {
  listMerchants,
  getMerchantById,
  createMerchant,
  updateMerchant,
  deleteMerchant,
};
