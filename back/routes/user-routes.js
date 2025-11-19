const express = require("express");
const bcrypt = require("bcrypt");
const { connectDB } = require("../db");
const { ObjectId } = require("mongodb");
const editProfileMiddleware = require("../middlewares/editProfileMiddleware");
require("dotenv").config();
const app = express();

app.post("/rejestracja", async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      description,
      classLevel,
    } = req.body;

    const hashedPass = bcrypt.hashSync(password, 10);

    const db = await connectDB();

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
      phoneNumber,
      description,
      classLevel,
      createdAt: new Date(),
      role: "user",
    });

    res.json(db.collection("users").find().toArray());
  } catch (err) {
    console.log(err);
  }
});

app.put("/users/:id", editProfileMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if(req.session.user._id !== id){
      return  res.status(403).json({ message: "Nie masz uprawnień do edycji tego profilu." });
    }

    const db = await connectDB();

    for (let key in updateData) {
      if (
        updateData[key] === "" ||
        updateData[key] === null ||
        updateData[key] === undefined
      ) {
        delete updateData[key];
      }
    }

    const result = await db
      .collection("users")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: "after" }
      );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Użytkownik nie znaleziony" });
    }

    req.session.user = result;

    res.json({ message: "Profil zaktualizowany", user: result.value });
  } catch (err) {
    console.log(err);
  }
});

app.post("/logowanie", async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = await connectDB();

    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Nieprawidłowy email lub hasło" });
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Nieprawidłowy email lub hasło" });
    }

    const { password: _, ...userData } = user;

    req.session.user = userData;

    res.json({ message: "Zalogowano", user: req.session.user });
  } catch (err) {
    console.error("[LOGIN] Error:", err);
    res.status(500).json({ message: "Błąd serwera" });
  }
});

app.get("/auth/me", (req, res) => {
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

module.exports = app;
