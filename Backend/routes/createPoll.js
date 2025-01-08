const router = require("express").Router();
const db = require("../db/db.connect");
const authentificated = require("../middlewares/autentificated");

router.post('/createPoll', authentificated, async (req, res) => {
  const { title, question, end_time, start_at } = req.body;
  const userID = req.userId;  // Assuming userID is set in the authentificated middleware
  console.log(userID);

  try {
    // Validate required fields
    if (!title || !question || !end_time || !start_at) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Insert poll into MySQL database
    const [result] = await db.query(
      'INSERT INTO polls (title, question, end_time, start_at, userID) VALUES (?, ?, ?, ?, ?)',
      [title, question, new Date(end_time), new Date(start_at), userID]
    );

    // Fetch the newly created poll data to return
    const [newPoll] = await db.query(
      'SELECT * FROM polls WHERE pollID = ?',
      [result.insertId]
    );

    // Prepare a reusable response structure
    const createdPollData = {
      pollID: newPoll[0].pollID,
      title: newPoll[0].title,
      question: newPoll[0].question,
      start_at: newPoll[0].start_at,
      end_time: newPoll[0].end_time,
      userID: newPoll[0].userID
    };

    // Return the created poll data
    res.status(201).json({ poll: createdPollData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating poll' });
  }
});

module.exports = router;
