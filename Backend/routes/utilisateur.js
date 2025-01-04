const router = require("express").Router();
const autentificated = require("../middlewares/autentificated");
const db = require("../db/db.connect"); // Ensure db connection is imported

router.get("/utilisateur", autentificated, async (req, res) => {
  try {
    // Get userId from the authenticated request (assumed to be set by the autentificated middleware)
    const userId = req.userId;
    console.log("User ID:", userId);
    

    if (!userId) {
      return res.status(400).json({ msg: "User ID is missing" });
    }

    // Query the database to fetch the user by userId
    const [rows] = await db.query("SELECT * FROM users WHERE userID = ?", [
      userId,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Send the user data as the response
    const user = rows[0];
    res.json(user);
  } catch (error) {
    console.error("Database error:", error.message);
    res.status(500).json({ msg: "Server error, please try again later." });
  }
});

module.exports = router;
