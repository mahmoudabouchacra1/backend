const bcrypt = require("bcryptjs");

const usersRepository = require("../repositories/usersRepository");

async function createUser(payload) {
  const existing = await usersRepository.findUserByEmail(payload.email);

  if (existing) {
    const error = new Error("email already exists");
    error.code = "EMAIL_EXISTS";
    throw error;
  }

  const passwordHash = await bcrypt.hash(payload.password, 10);
  const now = new Date();

  const user = await usersRepository.createUser({
    merchantId: payload.merchantId,
    vendorId: payload.vendorId ?? null,
    userType: payload.userType,
    fullName: payload.fullName,
    email: payload.email,
    passwordHash,
    phone: payload.phone ?? null,
    avatar: payload.avatar ?? null,
    isEmailVerified: payload.isEmailVerified ?? false,
    lastLoginAt: null,
    isActive: payload.isActive ?? true,
    createdAt: now,
    createdBy: payload.createdBy ?? 0,
    updatedAt: now,
    updatedBy: payload.updatedBy ?? null,
  });

  return user;
}

module.exports = {
  createUser,
};
