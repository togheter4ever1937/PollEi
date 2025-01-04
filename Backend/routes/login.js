const router = require("express").Router();
const db = require("../db/db.connect");
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ msg: "Please provide username and password" });
  }

  try {
    const [rows] = await db.query(
      "SELECT userID, PASSWORD FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ msg: "User not found!" });
    }

    const user = rows[0];
    console.log(user);

    if (user.PASSWORD !== password) {
      return res.status(401).json({ msg: "Invalid credentials!" });
    }

    const login_Token = jwt.sign({ id: user.userID }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    console.log(login_Token);
    res.json({ login_token: login_Token });
  } catch (error) {
    console.error("Database error:", error.message);
    res.status(500).json({ msg: "Server error, please try again later." });
  }
});

module.exports = router;
