function validateIdParam(req, res, next) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "invalid id" });
  }

  req.validatedId = id;
  next();
}

module.exports = {
  validateIdParam,
};