const vendorsRepository = require("../repositories/vendorsRepository");

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
    if (req.auth.userType === "ADMIN") {
      const vendors = await vendorsRepository.listVendors();
      return res.json({ data: vendors });
    }

    if (req.auth.userType === "MERCHANT" || req.auth.userType === "STAFF") {
      const vendors = await vendorsRepository.listVendorsByMerchantId(
        req.auth.merchantId
      );
      return res.json({ data: vendors });
    }

    if (req.auth.userType === "VENDOR" && req.auth.vendorId) {
      const vendors = await vendorsRepository.listVendorsById(req.auth.vendorId);
      return res.json({ data: vendors });
    }

    return res.status(403).json({ message: "access denied" });
  } catch (error) {
    res.status(500).json({ message: "database error" });
  }
}

async function getById(req, res) {
  try {
    if (req.auth.userType === "MERCHANT" || req.auth.userType === "STAFF") {
      const vendor = await vendorsRepository.getVendorById(req.validatedId);
      if (!vendor) {
        return res.status(404).json({ message: "vendor not found" });
      }
      if (vendor.merchantId !== req.auth.merchantId) {
        return res.status(403).json({ message: "access denied" });
      }
      return res.json({ data: vendor });
    }

    if (req.auth.userType === "VENDOR" && req.validatedId !== req.auth.vendorId) {
      return res.status(403).json({ message: "access denied" });
    }

    const vendor = await vendorsRepository.getVendorById(req.validatedId);
    if (!vendor) {
      return res.status(404).json({ message: "vendor not found" });
    }
    res.json({ data: vendor });
  } catch (error) {
    res.status(500).json({ message: "database error" });
  }
}

async function create(req, res) {
  if (req.auth.userType === "VENDOR" || req.auth.userType === "STAFF") {
    return res.status(403).json({ message: "access denied" });
  }
  const {
    merchantId,
    name,
    code,
    logo,
    email,
    phone,
    address,
    isActive,
  } = req.body || {};

  if (!name) {
    return res.status(400).json({ message: "name required" });
  }

  const parsedMerchantId = parseInteger(merchantId);
  if (!parsedMerchantId) {
    return res.status(400).json({ message: "valid merchantId required" });
  }
  if (
    req.auth.userType === "MERCHANT" &&
    parsedMerchantId !== req.auth.merchantId
  ) {
    return res.status(403).json({ message: "access denied" });
  }

  const now = new Date();
  const activeValue = parseBoolean(isActive);
  try {
    const vendor = await vendorsRepository.createVendor({
      merchantId: parsedMerchantId,
      name: String(name).trim(),
      code: code ? String(code) : null,
      logo: logo ? String(logo) : null,
      email: email ? String(email).trim().toLowerCase() : null,
      phone: phone ? String(phone) : null,
      address: address ? String(address) : null,
      isActive: activeValue ?? true,
      createdAt: now,
      createdBy: req.auth.userId,
      updatedAt: now,
      updatedBy: null,
    });

    res.status(201).json({ message: "vendor created", data: vendor });
  } catch (error) {
    res.status(500).json({ message: "database error" });
  }
}

async function update(req, res) {
  if (req.auth.userType === "VENDOR" || req.auth.userType === "STAFF") {
    return res.status(403).json({ message: "access denied" });
  }
  if (req.auth.userType === "MERCHANT") {
    const existingVendor = await vendorsRepository.getVendorById(
      req.validatedId
    );
    if (!existingVendor) {
      return res.status(404).json({ message: "vendor not found" });
    }
    if (existingVendor.merchantId !== req.auth.merchantId) {
      return res.status(403).json({ message: "access denied" });
    }
  }
  const {
    merchantId,
    name,
    code,
    logo,
    email,
    phone,
    address,
    isActive,
  } = req.body || {};

  const data = { updatedAt: new Date(), updatedBy: req.auth.userId };

  if (merchantId !== undefined) {
    const parsedMerchantId = parseInteger(merchantId);
    if (!parsedMerchantId) {
      return res.status(400).json({ message: "valid merchantId required" });
    }
    if (
      (req.auth.userType === "MERCHANT" || req.auth.userType === "STAFF") &&
      parsedMerchantId !== req.auth.merchantId
    ) {
      return res.status(403).json({ message: "access denied" });
    }
    data.merchantId = parsedMerchantId;
  }
  if (name !== undefined) {
    data.name = String(name).trim();
  }
  if (code !== undefined) {
    data.code = code ? String(code) : null;
  }
  if (logo !== undefined) {
    data.logo = logo ? String(logo) : null;
  }
  if (email !== undefined) {
    data.email = email ? String(email).trim().toLowerCase() : null;
  }
  if (phone !== undefined) {
    data.phone = phone ? String(phone) : null;
  }
  if (address !== undefined) {
    data.address = address ? String(address) : null;
  }
  if (isActive !== undefined) {
    const parsedActive = parseBoolean(isActive);
    if (parsedActive === null) {
      return res.status(400).json({ message: "valid isActive required" });
    }
    data.isActive = parsedActive;
  }
  if (Object.keys(data).length === 2) {
    return res.status(400).json({ message: "no fields to update" });
  }

  try {
    const vendor = await vendorsRepository.updateVendor(req.validatedId, data);
    res.json({ message: "vendor updated", data: vendor });
  } catch (error) {
    res.status(500).json({ message: "database error" });
  }
}

async function remove(req, res) {
  if (req.auth.userType !== "ADMIN") {
    return res.status(403).json({ message: "admin access required" });
  }
  try {
    await vendorsRepository.deleteVendor(req.validatedId);
    res.json({ message: "vendor deleted" });
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
