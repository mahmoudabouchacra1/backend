const countriesRepository = require("../repositories/countriesRepository");

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
    const countries = await countriesRepository.listCountries();
    res.json({ data: countries });
  } catch (error) {
    res.status(500).json({ message: "database error" });
  }
}

async function getById(req, res) {
  try {
    const country = await countriesRepository.getCountryById(req.validatedId);
    if (!country) {
      return res.status(404).json({ message: "country not found" });
    }
    res.json({ data: country });
  } catch (error) {
    res.status(500).json({ message: "database error" });
  }
}

async function create(req, res) {
  if (req.auth.userType !== "ADMIN") {
    return res.status(403).json({ message: "admin access required" });
  }
  const {
    name,
    iso2,
    iso3,
    phoneCode,
    currencyCode,
    currencyName,
    currencySymbol,
    flagUrl,
    isActive,
  } = req.body || {};

  if (!name || !iso2 || !iso3 || !phoneCode || !currencyCode || !currencyName) {
    return res.status(400).json({ message: "missing required fields" });
  }

  const now = new Date();
  const activeValue = parseBoolean(isActive);
  try {
    const country = await countriesRepository.createCountry({
      name: String(name).trim(),
      iso2: String(iso2).trim().toUpperCase(),
      iso3: String(iso3).trim().toUpperCase(),
      phoneCode: String(phoneCode).trim(),
      currencyCode: String(currencyCode).trim().toUpperCase(),
      currencyName: String(currencyName).trim(),
      currencySymbol: currencySymbol ? String(currencySymbol) : "",
      flagUrl: flagUrl ? String(flagUrl) : null,
      isActive: activeValue ?? true,
      createdAt: now,
      createdBy: req.auth.userId,
      updatedAt: now,
      updatedBy: null,
    });

    res.status(201).json({ message: "country created", data: country });
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
    iso2,
    iso3,
    phoneCode,
    currencyCode,
    currencyName,
    currencySymbol,
    flagUrl,
    isActive,
  } = req.body || {};

  const data = { updatedAt: new Date(), updatedBy: req.auth.userId };

  if (name !== undefined) {
    data.name = String(name).trim();
  }
  if (iso2 !== undefined) {
    data.iso2 = String(iso2).trim().toUpperCase();
  }
  if (iso3 !== undefined) {
    data.iso3 = String(iso3).trim().toUpperCase();
  }
  if (phoneCode !== undefined) {
    data.phoneCode = String(phoneCode).trim();
  }
  if (currencyCode !== undefined) {
    data.currencyCode = String(currencyCode).trim().toUpperCase();
  }
  if (currencyName !== undefined) {
    data.currencyName = String(currencyName).trim();
  }
  if (currencySymbol !== undefined) {
    data.currencySymbol = currencySymbol ? String(currencySymbol) : "";
  }
  if (flagUrl !== undefined) {
    data.flagUrl = flagUrl ? String(flagUrl) : null;
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
    const country = await countriesRepository.updateCountry(req.validatedId, data);
    res.json({ message: "country updated", data: country });
  } catch (error) {
    res.status(500).json({ message: "database error" });
  }
}

async function remove(req, res) {
  if (req.auth.userType !== "ADMIN") {
    return res.status(403).json({ message: "admin access required" });
  }
  try {
    await countriesRepository.deleteCountry(req.validatedId);
    res.json({ message: "country deleted" });
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
