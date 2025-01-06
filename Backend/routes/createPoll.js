const router = require("express").Router();
const db = require("../db/db.connect");

const authentificated = require("../middlewares/autentificated");


router.post("/createPoll", authentificated, async (req, res) => {
  const { title, question, start_at, end_time } = req.body;

  if (!title || !question || !start_at || !end_time) {
    return res.status(400).send({ msg: "All fields are required!" });
  }

  const userID = req.userId;  // Assuming the userId is set by the 'authentificated' middleware.

  const query = `
    INSERT INTO polls (title, question, start_at, end_time, userID)
    VALUES (?, ?, ?, ?, ?)
  `;

  const values = [title, question, start_at, end_time, userID];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error creating poll:", err);
      return res.status(500).send({ msg: "Error creating poll", error: err }); // Respond and return to avoid further execution
    }

    // Send the success response
    return res.status(201).send({
      msg: "Poll created successfully!",
      poll: {
        pollID: result.insertId,
        title,
        question,
        start_at,
        end_time,
        userID,
      },
    });
  });
});

module.exports = router;
