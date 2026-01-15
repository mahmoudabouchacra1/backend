const jwt = require("jsonwebtoken");

const usersRepository = require("../../repositories/usersRepository");

function getTokenFromHeader(req) {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) {
    return null;
  }
  return header.slice(7).trim();
}

async function requireAuth(req, res, next) {
  const token = getTokenFromHeader(req);

  if (!token) {
    return res.status(401).json({ message: "missing auth token" });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ message: "auth not configured" });
  }

  try {
    const payload = jwt.verify(token, secret);
    const user = await usersRepository.getUserById(payload.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({ message: "invalid auth token" });
    }

    req.auth = {
      userId: user.id,
      userType: user.userType,
      merchantId: user.merchantId,
      vendorId: user.vendorId,
    };

    next();
  } catch (error) {
    res.status(401).json({ message: "invalid auth token" });
  }
}

module.exports = {
  requireAuth,
};
