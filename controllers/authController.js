const authService = require("../services/authService");

async function register(req, res) {
  const { email, password, fullName, merchantName, countryId, plan } =
    req.validatedRegister;

  try {
    const user = await authService.register({
      email,
      password,
      fullName,
      merchantName,
      countryId,
      plan,
    });
    res.status(201).json({
      message: "registered successfully",
      data: user,
    });
  } catch (error) {
    if (error?.code === "EMAIL_EXISTS" || error?.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "email already exists" });
    }
    res.status(500).json({ message: "database error" });
  }
}

async function login(req, res) {
  const { email, password } = req.validatedAuth;

  try {
    const user = await authService.login({ email, password });

    if (!user) {
      return res.status(401).json({ message: "invalid credentials" });
    }

    res.json({ message: "login successful", data: user });
  } catch (error) {
    res.status(500).json({ message: "database error" });
  }
}

module.exports = {
  register,
  login,
};
