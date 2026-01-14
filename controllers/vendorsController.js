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
    const vendors = await vendorsRepository.listVendors();
    res.json({ data: vendors });
  } catch (error) {
    res.status(500).json({ message: "database error" });
  }
}

async function getById(req, res) {
  try {
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
  const {
    merchantId,
    name,
    code,
    logo,
    email,
    phone,
    address,
    isActive,
    createdBy,
  } = req.body || {};

  if (!name) {
    return res.status(400).json({ message: "name required" });
  }

  const parsedMerchantId = parseInteger(merchantId);
  if (!parsedMerchantId) {
    return res.status(400).json({ message: "valid merchantId required" });
  }

  const now = new Date();
  const activeValue = parseBoolean(isActive);
  const creatorId = parseInteger(createdBy) ?? 0;

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
      createdBy: creatorId,
      updatedAt: now,
      updatedBy: null,
    });

    res.status(201).json({ message: "vendor created", data: vendor });
  } catch (error) {
    res.status(500).json({ message: "database error" });
  }
}

async function update(req, res) {
  const {
    merchantId,
    name,
    code,
    logo,
    email,
    phone,
    address,
    isActive,
    updatedBy,
  } = req.body || {};

  const data = { updatedAt: new Date() };

  if (merchantId !== undefined) {
    const parsedMerchantId = parseInteger(merchantId);
    if (!parsedMerchantId) {
      return res.status(400).json({ message: "valid merchantId required" });
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
  if (updatedBy !== undefined) {
    const parsedUpdatedBy = parseInteger(updatedBy);
    if (!parsedUpdatedBy) {
      return res.status(400).json({ message: "valid updatedBy required" });
    }
    data.updatedBy = parsedUpdatedBy;
  }

  if (Object.keys(data).length === 1) {
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
