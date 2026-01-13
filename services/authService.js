const bcrypt = require("bcryptjs");

const usersRepository = require("../repositories/usersRepository");

async function register(payload) {
  const { email, password } = payload;
  const passwordHash = await bcrypt.hash(password, 10);
  const userId = await usersRepository.createUser(email, passwordHash);

  return { id: userId, email };
}

async function login(payload) {
  const { email, password } = payload;
  const user = await usersRepository.findUserByEmail(email);

  if (!user) {
    return null;
  }

  const matches = await bcrypt.compare(password, user.passwordHash);

  if (!matches) {
    return null;
  }

  return { id: user.id, email };
}

module.exports = {
  register,
  login,
};
