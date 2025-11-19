const express = require("express");
const bcrypt = require("bcrypt");
const { connectDB } = require("../db");
const { ObjectId } = require("mongodb");
const editProfileMiddleware = require("../middlewares/editProfileMiddleware");
require("dotenv").config();
const app = express();

app.get("/book/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const db = await connectDB();

    const book = await db.collection("books").findOne({ _id: parseInt(id) });

    res.json({ book });
  } catch (err) {
    res.status(501).json({ message: "Błąd serwera asd." });
  }
});

app.get("/books", async (req, res) => {
  try {
    const { page } = req.query;
    const db = await connectDB();

    const books = await db
      .collection("books")
      .find()
      .limit(10)
      .skip((page - 1) * 10)
      .toArray();
    const booksCount = await db.collection("books").countDocuments();

    res.json({ books, booksCount });
  } catch (err) {
    res.status(500).json({ message: "Błąd serwera." });
  }
});



module.exports = app;
