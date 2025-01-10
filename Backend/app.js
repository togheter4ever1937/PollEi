const express = require("express");
const app = express();
const cors = require("cors");
const path = require('path');
const loginRouter = require("./routes/login");
const createPoll = require("./routes/createPoll");
const addOptions = require("./routes/addOptions");
const activePolls = require("./routes/activePolls");
const endedPolls = require("./routes/endedPolls");
const getOptions = require("./routes/getOptions");
const validateVote = require("./routes/validateVote");
const usersRouter = require("./routes/utilisateur");
const signupRouter = require("./routes/signup");
const getVotes = require("./routes/getVotes");
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
app.use("/api", createPoll);
app.use("/api",addOptions);
app.use("/api",activePolls);
app.use("/api",endedPolls);
app.use("/api",getOptions);
app.use("/api",validateVote);
app.use("/api",getVotes);






app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
