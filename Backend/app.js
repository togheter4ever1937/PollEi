const express = require("express");
const app = express();
const cors = require("cors");
const path = require('path');
const loginRouter = require("./routes/login");
const usersRouter = require("./routes/utilisateur");
const signupRouter = require("./routes/signup");
const session = require("express-session");

const corsOptions = {
  origin: "http://localhost:4200",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

app.use("/api", usersRouter);
app.use("/api", signupRouter);
app.use("/api", loginRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
