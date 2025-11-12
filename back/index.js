const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");
require("dotenv").config();

// Port, na którym nasłuchuje serwer
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
    },
  })
);

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
const dbName = process.env.DB_NAME;

MongoClient.connect(uri)
  .then((client) => {
    console.log("Connected to Database");
  })
  .catch((error) => console.error(error));

app.post("/rejestracja", async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    const hashedPass = bcrypt.hashSync(password, 10);
    await client.connect();

    const db = client.db(dbName);

    if (await db.collection("users").findOne({ email })) {
      res
        .status(400)
        .json({ message: "Użytkownik o podanym emailu już istnieje." });
      return;
    }

    db.collection("users").insertOne({
      email,
      password: hashedPass,
      firstName,
      lastName,
    });

    res.json(db.collection("users").find().toArray());
  } catch (err) {
    console.log(err);
  }
});

app.post("/logowanie", async (req, res) => {
  try {
    const { email, password } = req.body;

    await client.connect();
    const db = client.db(dbName);

    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Nieprawidłowy email lub hasło" });
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Nieprawidłowy email lub hasło" });
    }

    req.session.user = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    res.json({ message: "Zalogowano", user: req.session.user });
  } catch (err) {
    console.error("[LOGIN] Error:", err);
    res.status(500).json({ message: "Błąd serwera" });
  }
});

app.get("/api/auth/me", (req, res) => {
  if (req.session?.user)
    return res.json({ loggedIn: true, user: req.session.user });
  return res.status(401).json({ loggedIn: false });
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Błąd podczas wylogowywania" });
    }

    res.clearCookie("connect.sid");
    res.json({ message: "Wylogowano" });
  });
});

app.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});
