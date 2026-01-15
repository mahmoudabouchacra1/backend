const prisma = require("../server/prisma");

async function listVendors() {
  return prisma.vendor.findMany({
    include: { merchant: true },
    orderBy: { createdAt: "desc" },
  });
}

async function listVendorsByMerchantId(merchantId) {
  return prisma.vendor.findMany({
    where: { merchantId },
    include: { merchant: true },
    orderBy: { createdAt: "desc" },
  });
}

async function listVendorsById(id) {
  return prisma.vendor.findMany({
    where: { id },
    include: { merchant: true },
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
  listVendorsByMerchantId,
  listVendorsById,
  getVendorById,
  createVendor,
  updateVendor,
  deleteVendor,
};
