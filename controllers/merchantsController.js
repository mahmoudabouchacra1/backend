const merchantsRepository = require("../repositories/merchantsRepository");

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
      const merchants = await merchantsRepository.listMerchants();
      return res.json({ data: merchants });
    }

    if (req.auth.userType === "MERCHANT") {
      const merchants = await merchantsRepository.listMerchantsById(
        req.auth.merchantId
      );
      return res.json({ data: merchants });
    }

    return res.status(403).json({ message: "access denied" });
  } catch (error) {
    res.status(500).json({ message: "database error" });
  }
}

async function getById(req, res) {
  try {
    if (req.auth.userType === "MERCHANT" && req.validatedId !== req.auth.merchantId) {
      return res.status(403).json({ message: "access denied" });
    }
    const merchant = await merchantsRepository.getMerchantById(req.validatedId);
    if (!merchant) {
      return res.status(404).json({ message: "merchant not found" });
    }
    res.json({ data: merchant });
  } catch (error) {
    res.status(500).json({ message: "database error" });
  }
}

const allowedPlans = new Set(["FREE", "PRO", "ENTERPRISE"]);

async function create(req, res) {
  if (req.auth.userType !== "ADMIN") {
    return res.status(403).json({ message: "admin access required" });
  }
  const {
    name,
    logo,
    email,
    phone,
    address,
    plan,
    countryId,
    isActive,
  } = req.body || {};

  if (!name || !plan) {
    return res.status(400).json({ message: "name and plan required" });
  }
  const normalizedPlan = String(plan).trim().toUpperCase();
  if (!allowedPlans.has(normalizedPlan)) {
    return res.status(400).json({ message: "invalid plan" });
  }

  const parsedCountryId = parseInteger(countryId);
  if (!parsedCountryId) {
    return res.status(400).json({ message: "valid countryId required" });
  }

  const now = new Date();
  const activeValue = parseBoolean(isActive);
  try {
    const merchant = await merchantsRepository.createMerchant({
      name: String(name).trim(),
      logo: logo ? String(logo) : null,
      email: email ? String(email).trim().toLowerCase() : null,
      phone: phone ? String(phone) : null,
      address: address ? String(address) : null,
      plan: normalizedPlan,
      countryId: parsedCountryId,
      isActive: activeValue ?? true,
      createdAt: now,
      createdBy: req.auth.userId,
      updatedAt: now,
      updatedBy: null,
    });

    res.status(201).json({ message: "merchant created", data: merchant });
  } catch (error) {
    res.status(500).json({ message: "database error" });
  }
}

async function update(req, res) {
  if (req.auth.userType !== "ADMIN") {
    return res.status(403).json({ message: "admin access required" });
  }
  const {
    name,
    logo,
    email,
    phone,
    address,
    plan,
    countryId,
    isActive,
  } = req.body || {};

  const data = { updatedAt: new Date(), updatedBy: req.auth.userId };

  if (name !== undefined) {
    data.name = String(name).trim();
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
  if (plan !== undefined) {
    const normalizedUpdatePlan = String(plan).trim().toUpperCase();
    if (!allowedPlans.has(normalizedUpdatePlan)) {
      return res.status(400).json({ message: "invalid plan" });
    }
    data.plan = normalizedUpdatePlan;
  }
  if (countryId !== undefined) {
    const parsedCountryId = parseInteger(countryId);
    if (!parsedCountryId) {
      return res.status(400).json({ message: "valid countryId required" });
    }
    data.countryId = parsedCountryId;
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
    const merchant = await merchantsRepository.updateMerchant(
      req.validatedId,
      data,
    );
    res.json({ message: "merchant updated", data: merchant });
  } catch (error) {
    res.status(500).json({ message: "database error" });
  }
}

async function remove(req, res) {
  if (req.auth.userType !== "ADMIN") {
    return res.status(403).json({ message: "admin access required" });
  }
  try {
    await merchantsRepository.deleteMerchant(req.validatedId);
    res.json({ message: "merchant deleted" });
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
