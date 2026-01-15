const usersRepository = require("../repositories/usersRepository");
const usersService = require("../services/usersService");

const allowedUserTypes = new Set(["ADMIN", "MERCHANT", "VENDOR", "STAFF"]);

function parseInteger(value) {
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : null;
}

function parseBoolean(value) {
  if (typeof value === "boolean") {
    return value;
  }
  if (value === "true") {
    return true;
  }
  if (value === "false") {
    return false;
  }
  return null;
}

async function list(req, res) {
  try {
    const users = await usersRepository.listUsers();
    res.json({ data: users });
  } catch (error) {
    res.status(500).json({ message: "database error" });
  }
}

async function getById(req, res) {
  try {
    const user = await usersRepository.getUserById(req.validatedId);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    res.json({ data: user });
  } catch (error) {
    res.status(500).json({ message: "database error" });
  }
}

async function create(req, res) {
  const {
    merchantId,
    vendorId,
    userType,
    fullName,
    email,
    password,
    phone,
    avatar,
    isEmailVerified,
    isActive,
  } = req.body || {};

  if (!merchantId || !userType || !fullName || !email || !password) {
    return res.status(400).json({ message: "missing required fields" });
  }

  const parsedMerchantId = parseInteger(merchantId);
  if (!parsedMerchantId) {
    return res.status(400).json({ message: "valid merchantId required" });
  }

  const normalizedUserType = String(userType).trim().toUpperCase();
  if (!allowedUserTypes.has(normalizedUserType)) {
    return res.status(400).json({ message: "invalid userType" });
  }

  const parsedVendorId = vendorId ? parseInteger(vendorId) : null;
  if (vendorId !== undefined && vendorId !== null && !parsedVendorId) {
    return res.status(400).json({ message: "valid vendorId required" });
  }
  if (normalizedUserType === "VENDOR" && !parsedVendorId) {
    return res.status(400).json({ message: "vendorId required for VENDOR" });
  }

  const activeValue = parseBoolean(isActive);
  const verifiedValue = parseBoolean(isEmailVerified);
  try {
    const user = await usersService.createUser({
      merchantId: parsedMerchantId,
      vendorId: parsedVendorId,
      userType: normalizedUserType,
      fullName: String(fullName).trim(),
      email: String(email).trim().toLowerCase(),
      password,
      phone: phone ? String(phone) : null,
      avatar: avatar ? String(avatar) : null,
      isEmailVerified: verifiedValue ?? false,
      isActive: activeValue ?? true,
      createdBy: req.auth.userId,
      updatedBy: null,
    });

    res.status(201).json({ message: "user created", data: user });
  } catch (error) {
    if (error.code === "EMAIL_EXISTS") {
      return res.status(409).json({ message: "email already exists" });
    }
    res.status(500).json({ message: "database error" });
  }
}

async function update(req, res) {
  const {
    merchantId,
    vendorId,
    userType,
    fullName,
    email,
    phone,
    avatar,
    isEmailVerified,
    isActive,
    lastLoginAt,
  } = req.body || {};

  const data = { updatedAt: new Date(), updatedBy: req.auth.userId };

  if (merchantId !== undefined) {
    const parsedMerchantId = parseInteger(merchantId);
    if (!parsedMerchantId) {
      return res.status(400).json({ message: "valid merchantId required" });
    }
    data.merchantId = parsedMerchantId;
  }

  if (vendorId !== undefined) {
    if (vendorId === null) {
      data.vendorId = null;
    } else {
      const parsedVendorId = parseInteger(vendorId);
      if (!parsedVendorId) {
        return res.status(400).json({ message: "valid vendorId required" });
      }
      data.vendorId = parsedVendorId;
    }
  }

  if (userType !== undefined) {
    const normalizedUpdateType = String(userType).trim().toUpperCase();
    if (!allowedUserTypes.has(normalizedUpdateType)) {
      return res.status(400).json({ message: "invalid userType" });
    }
    data.userType = normalizedUpdateType;
  }
  if (fullName !== undefined) {
    data.fullName = String(fullName).trim();
  }
  if (email !== undefined) {
    data.email = String(email).trim().toLowerCase();
  }
  if (phone !== undefined) {
    data.phone = phone ? String(phone) : null;
  }
  if (avatar !== undefined) {
    data.avatar = avatar ? String(avatar) : null;
  }
  if (isEmailVerified !== undefined) {
    const parsedVerified = parseBoolean(isEmailVerified);
    if (parsedVerified === null) {
      return res.status(400).json({ message: "valid isEmailVerified required" });
    }
    data.isEmailVerified = parsedVerified;
  }
  if (isActive !== undefined) {
    const parsedActive = parseBoolean(isActive);
    if (parsedActive === null) {
      return res.status(400).json({ message: "valid isActive required" });
    }
    data.isActive = parsedActive;
  }
  if (lastLoginAt !== undefined) {
    const parsedDate = lastLoginAt ? new Date(lastLoginAt) : null;
    if (parsedDate && Number.isNaN(parsedDate.valueOf())) {
      return res.status(400).json({ message: "valid lastLoginAt required" });
    }
    data.lastLoginAt = parsedDate;
  }
  if (Object.keys(data).length === 2) {
    return res.status(400).json({ message: "no fields to update" });
  }

  try {
    const user = await usersRepository.updateUser(req.validatedId, data);
    res.json({ message: "user updated", data: user });
  } catch (error) {
    res.status(500).json({ message: "database error" });
  }
}

async function remove(req, res) {
  try {
    await usersRepository.deleteUser(req.validatedId);
    res.json({ message: "user deleted" });
  } catch (error) {
    res.status(500).json({ message: "database error" });
  }
}

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
};
