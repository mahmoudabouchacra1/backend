const prisma = require("../server/prisma");

async function listVendors() {
  return prisma.vendor.findMany({
    include: { merchant: true },
    orderBy: { createdAt: "desc" },
  });
}

async function getVendorById(id) {
  return prisma.vendor.findUnique({
    where: { id },
    include: { merchant: true },
  });
}

async function createVendor(data) {
  return prisma.vendor.create({ data });
}

async function updateVendor(id, data) {
  return prisma.vendor.update({ where: { id }, data });
}

async function deleteVendor(id) {
  return prisma.vendor.delete({ where: { id } });
}

module.exports = {
  listVendors,
  getVendorById,
  createVendor,
  updateVendor,
  deleteVendor,
};
