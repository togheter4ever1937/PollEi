const router = require("express").Router();
const autentificated = require("../middlewares/autentificated");
const db = require("../db/db.connect");

router.get("/utilisateur", autentificated, async (req, res) => {
  try {
   
    const userId = req.userId;
    console.log("User ID:", userId);
    

    if (!userId) {
      return res.status(400).json({ msg: "User ID is missing" });
    }

    
    const [rows] = await db.query("SELECT * FROM users WHERE userID = ?", [
      userId,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

  
    const user = rows[0];
    res.json(user);
  } catch (error) {
    console.error("Database error:", error.message);
    res.status(500).json({ msg: "Server error, please try again later." });
  }
});

module.exports = router;
