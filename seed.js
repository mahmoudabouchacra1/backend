require("dotenv").config();

const bcrypt = require("bcryptjs");
const mysql = require("mysql2/promise");

const users = Array.from({ length: 10 }, (_, index) => ({
  email: `user${index + 1}@example.com`,
  password: `Password${index + 1}!`,
}));

async function seedUsers() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 5,
  });

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const hashedUsers = await Promise.all(
      users.map(async (user) => ({
        email: user.email,
        passwordHash: await bcrypt.hash(user.password, 10),
      }))
    );

    const values = hashedUsers.map((user) => [user.email, user.passwordHash]);
    await pool.query(
      "INSERT INTO users (email, password_hash) VALUES ?",
      [values]
    );

    console.log("Seeded users:");
    users.forEach((user) => {
      console.log(`- ${user.email} / ${user.password}`);
    });
  } finally {
    await pool.end();
  }
}

seedUsers().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
