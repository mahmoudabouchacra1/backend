const jwt = require("jsonwebtoken");

const authService = require("../services/authService");
const usersRepository = require("../repositories/usersRepository");

function createToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(
    {
      userId: user.id,
      userType: user.userType,
      merchantId: user.merchantId,
    },
    secret,
    { expiresIn: "7d" }
  );
}

async function register(req, res) {
  const { email, password, fullName, merchantName, countryId, plan } =
    req.validatedRegister;

  try {
    const result = await authService.register({
      email,
      password,
      fullName,
      merchantName,
      countryId,
      plan,
    });
    const token = createToken(result.user);
    res.status(201).json({
      message: "registered successfully",
      data: {
        user: result.user,
        merchant: result.merchant,
      },
      token,
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

    const token = createToken(user);

    res.json({ message: "login successful", data: user, token });
  } catch (error) {
    res.status(500).json({ message: "database error" });
  }
}

module.exports = {
  register,
  login,
  async me(req, res) {
    try {
      const user = await usersRepository.getUserById(req.auth.userId);
      if (!user) {
        return res.status(404).json({ message: "user not found" });
      }
      res.json({ data: user });
    } catch (error) {
      res.status(500).json({ message: "database error" });
    }
  },
};
