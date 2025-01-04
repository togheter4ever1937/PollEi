const router = require("express").Router();
const db = require("../db/db.connect");
const checkEmptyFields = require("../middlewares/checkEmptyFields");
const verificationCode = require("../middlewares/verificationCode");
const mailSender = require("../middlewares/mailSender");
const multer = require("multer");
const path = require("path");

let serverCode;
let userId;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

router.post(
  "/signup",
  upload.single("image"),
  checkEmptyFields,
  verificationCode,
  async (req, res) => {
    const { name, password, email } = req.body;
    serverCode = Number(req.random);
    const user = {
      username: name,
      password: password,
      email: email,
      image: req.file ? req.file.filename : null,
    };
    console.log("random code: ", serverCode);

    try {
      const [result] = await db.query(
        "INSERT INTO users (username, PASSWORD, email, image, created_at, isVerified) VALUES (?, ?, ?, ?, NOW(), ?)",
        [user.username, user.password, user.email, user.image, 0]
      );
      userId = result.insertId;
      mailSender(serverCode, user);
      res.send({ msg: "User created successfully. Please verify your email." });
    } catch (error) {
      console.error("Error storing user in the database:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.post("/accVerification", async (req, res) => {
  const { code } = req.body;
  console.log("userCode: ", typeof code, "value: ", code);
  console.log(
    "code from the server: ",
    typeof serverCode,
    "value: ",
    serverCode
  );
  console.log("userId: ", typeof userId, "value: ", userId);

  if (Number(code) === serverCode) {
    try {
      await db.query("UPDATE users SET isVerified = 1 WHERE userID = ?", [
        userId,
      ]);
      serverCode = 0;
      console.log(`User with ID ${userId} has been verified.`);
      userId = 0;
      return res.send({ msg: "User verified successfully." });
    } catch (error) {
      console.error("Error updating verification status:", error.message);
      return res.status(500).send({ msg: "Database error. Please try again." });
    }
  }
  return res
    .status(400)
    .send({ msg: "Invalid code. Please check and try again." });
});

module.exports = router;
