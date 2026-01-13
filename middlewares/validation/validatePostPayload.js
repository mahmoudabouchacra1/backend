function validatePostPayload(req, res, next) {
  const { title, body } = req.body || {};

  if (title != null && typeof title !== "string") {
    return res.status(400).json({ message: "title must be a string" });
  }

  if (body != null && typeof body !== "string") {
    return res.status(400).json({ message: "body must be a string" });
  }

  next();
}

module.exports = {
  validatePostPayload,
};