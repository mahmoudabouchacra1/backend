const allowedPlans = new Set(["FREE", "PRO", "ENTERPRISE"]);

function validateRegisterPayload(req, res, next) {
  const { email, password, fullName, merchantName, countryId, plan } =
    req.body || {};

  if (!email || !password || !fullName || !merchantName || !plan) {
    return res.status(400).json({ message: "missing required fields" });
  }

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof fullName !== "string" ||
    typeof merchantName !== "string" ||
    typeof plan !== "string"
  ) {
    return res.status(400).json({ message: "invalid payload" });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPlan = plan.trim().toUpperCase();

  if (!normalizedEmail || !allowedPlans.has(normalizedPlan)) {
    return res.status(400).json({ message: "invalid payload" });
  }

  let parsedCountryId = null;

  if (countryId !== undefined && countryId !== null && countryId !== "") {
    const parsed = Number(countryId);
    if (!Number.isInteger(parsed)) {
      return res.status(400).json({ message: "invalid countryId" });
    }
    parsedCountryId = parsed;
  }

  req.validatedRegister = {
    email: normalizedEmail,
    password,
    fullName: fullName.trim(),
    merchantName: merchantName.trim(),
    countryId: parsedCountryId,
    plan: normalizedPlan,
  };

  next();
}

module.exports = {
  validateRegisterPayload,
};
