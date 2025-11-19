const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const userRoutes = require("./routes/user-routes");
const { connectDB, testConnection } = require("./db");
const { createSuperAdmin } = require("./utils/createSuperAdmin");

const PORT = 3000;

const app = express();

// Enable express to parse JSON bodies
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

testConnection()

async function start() {

  const db = await connectDB();
  
  await createSuperAdmin(db);

  app.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});
}

app.use("/api", userRoutes);
app.use("/books", require("./routes/books-routes"));

start();

