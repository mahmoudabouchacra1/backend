const bcrypt = require("bcryptjs");

const prisma = require("../server/prisma");
const usersRepository = require("../repositories/usersRepository");

async function register(payload) {
  const { email, password, fullName, merchantName, countryId, plan } = payload;
  const existing = await usersRepository.findUserByEmail(email);

  if (existing) {
    const error = new Error("email already exists");
    error.code = "EMAIL_EXISTS";
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const now = new Date();

  const userSelect = {
    id: true,
    email: true,
    userType: true,
    merchantId: true,
    fullName: true,
    isActive: true,
    isEmailVerified: true,
    createdAt: true,
  };

  const result = await prisma.$transaction(async (tx) => {
    let resolvedCountryId = countryId;

    if (!resolvedCountryId) {
      const existingCountry = await tx.country.findFirst({
        select: { id: true },
      });

      if (existingCountry) {
        resolvedCountryId = existingCountry.id;
      } else {
        const createdCountry = await tx.country.create({
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
        resolvedCountryId = createdCountry.id;
      }
    }

    const merchant = await tx.merchant.create({
      data: {
        name: merchantName,
        logo: null,
        email: email,
        phone: null,
        countryId: resolvedCountryId,
        address: null,
        plan,
        isActive: true,
        createdAt: now,
        createdBy: 0,
        updatedAt: now,
        updatedBy: null,
      },
    });

    const user = await tx.user.create({
      data: {
        merchantId: merchant.id,
        vendorId: null,
        userType: "MERCHANT",
        fullName,
        email,
        passwordHash,
        phone: null,
        avatar: null,
        isEmailVerified: false,
        lastLoginAt: null,
        isActive: true,
        createdAt: now,
        createdBy: 0,
        updatedAt: now,
        updatedBy: null,
      },
      select: userSelect,
    });

    return { merchant, user };
  });

  return {
    user: result.user,
    merchant: result.merchant,
  };
}

async function login(payload) {
  const { email, password } = payload;
  const user = await usersRepository.findUserByEmail(email);

  if (!user || !user.isActive) {
    return null;
  }

  const matches = await bcrypt.compare(password, user.passwordHash);

  if (!matches) {
    return null;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      lastLoginAt: new Date(),
      updatedAt: new Date(),
      updatedBy: null,
    },
  });

  return {
    id: user.id,
    email: user.email,
    userType: user.userType,
    merchantId: user.merchantId,
  };
}

module.exports = {
  register,
  login,
};
