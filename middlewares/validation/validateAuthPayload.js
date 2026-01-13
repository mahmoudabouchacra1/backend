function validateAuthPayload(req, res, next) {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "email and password required" });
  }

  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ message: "email and password required" });
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    return res.status(400).json({ message: "email and password required" });
  }

  req.validatedAuth = {
    email: normalizedEmail,
    password,
  };

  next();
}

module.exports = {
  validateAuthPayload,
};