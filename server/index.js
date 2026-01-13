require("dotenv").config();

const app = require("./app");
const prisma = require("./prisma");

const port = process.env.PORT || 3000;

prisma
  .$connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Express API listening on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize database", error);
    process.exit(1);
  });
