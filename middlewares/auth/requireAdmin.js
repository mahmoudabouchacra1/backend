function requireAdmin(req, res, next) {
  if (!req.auth || req.auth.userType !== "ADMIN") {
    return res.status(403).json({ message: "admin access required" });
  }

  next();
}

module.exports = {
  requireAdmin,
};
