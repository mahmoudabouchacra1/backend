const prisma = require("../server/prisma");

async function listCountries() {
  return prisma.country.findMany({ orderBy: { name: "asc" } });
}

async function getCountryById(id) {
  return prisma.country.findUnique({ where: { id } });
}

async function createCountry(data) {
  return prisma.country.create({ data });
}

async function updateCountry(id, data) {
  return prisma.country.update({ where: { id }, data });
}

async function deleteCountry(id) {
  return prisma.country.delete({ where: { id } });
}

module.exports = {
  listCountries,
  getCountryById,
  createCountry,
  updateCountry,
  deleteCountry,
};
