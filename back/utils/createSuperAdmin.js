const bcrypt = require("bcrypt");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

async function createSuperAdmin(db) {
  const users = db.collection("users");
  const count = await users.countDocuments();

  if (count > 0) {
    console.log("✔ Users exist — skipping superuser creation");
    return;
  }

  const generatedPassword = crypto.randomBytes(6).toString("hex");

  const hashedPass = await bcrypt.hash(generatedPassword, 10);

  const superUser = {
    email: "admin",
    password: hashedPass,
    firstName: "Super",
    lastName: "Admin",
    createdAt: new Date(),
    role: "admin",
  };

  await users.insertOne(superUser);

  console.log("✔ Superuser created");

  writeLog({
    action: "CREATE_SUPERUSER",
    createdAt: new Date().toISOString(),
    email: superUser.email,
    generatedPassword,
  });
}

function writeLog(logEntry) {
  const filePath = path.join(process.cwd(), "logs.json");

  let existing = [];

  if (fs.existsSync(filePath)) {
    try {
      const raw = fs.readFileSync(filePath, "utf8");
      existing = JSON.parse(raw);
    } catch {
      existing = [];
    }
  }

  existing.push(logEntry);

  fs.writeFileSync(filePath, JSON.stringify(existing, null, 2), "utf8");

  console.log("✔ Log saved to logs.json");
}

module.exports = { createSuperAdmin };
