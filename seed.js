require("dotenv").config();

const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function ensureDefaultCountry() {
  const existing = await prisma.country.findFirst();

  if (existing) {
    return existing;
  }

  const now = new Date();
  return prisma.country.create({
    data: {
      name: "Default",
      iso2: "DF",
      iso3: "DFT",
      phoneCode: "+0",
      currencyCode: "N/A",
      currencyName: "Unknown",
      currencySymbol: "-",
      flagUrl: null,
      isActive: true,
      createdAt: now,
      createdBy: 0,
      updatedAt: now,
      updatedBy: null,
    },
  });
}

async function ensureAdminUser() {
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@example.com")
    .trim()
    .toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin123!";
  const adminName = process.env.ADMIN_FULL_NAME || "Platform Admin";

  const existing = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existing) {
    console.log(`Admin already exists: ${adminEmail}`);
    return existing;
  }

  const now = new Date();
  const country = await ensureDefaultCountry();

  const merchant = await prisma.merchant.create({
    data: {
      name: "Platform Admin",
      logo: null,
      email: adminEmail,
      phone: null,
      countryId: country.id,
      address: null,
      plan: "ENTERPRISE",
      isActive: true,
      createdAt: now,
      createdBy: 0,
      updatedAt: now,
      updatedBy: null,
    },
  });

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const user = await prisma.user.create({
    data: {
      merchantId: merchant.id,
      vendorId: null,
      userType: "ADMIN",
      fullName: adminName,
      email: adminEmail,
      passwordHash,
      phone: null,
      avatar: null,
      isEmailVerified: true,
      lastLoginAt: null,
      isActive: true,
      createdAt: now,
      createdBy: 0,
      updatedAt: now,
      updatedBy: null,
    },
  });

  console.log(`Created admin: ${adminEmail}`);
  return user;
}

async function seed() {
  try {
    await ensureAdminUser();
  } finally {
    await prisma.$disconnect();
  }
}

seed().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
