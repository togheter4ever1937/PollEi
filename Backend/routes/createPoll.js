const router = require("express").Router();
const db = require("../db/db.connect");
const authentificated = require("../middlewares/autentificated");
const validatePollTime = require("../middlewares/ValidatePollTime");
const deletePollIfNoOptions = require("../middlewares/deletePollIfNoOptions");

router.post('/createPoll', authentificated,validatePollTime, async (req, res) => {
  const { title, question, end_time, start_at } = req.body;
  const userID = req.userId;  
  console.log(userID);

  try {
   
    if (!title || !question || !end_time || !start_at) {
      return res.status(400).json({ message: 'All fields are required' });
    }

   
    const [result] = await db.query(
      'INSERT INTO polls (title, question, end_time, start_at, userID) VALUES (?, ?, ?, ?, ?)',
      [title, question, new Date(end_time), new Date(start_at), userID]
    );

    const pollID = result.insertId;
    deletePollIfNoOptions(pollID);

    
    const [newPoll] = await db.query(
      'SELECT * FROM polls WHERE pollID = ?',
      [result.insertId]
    );

    
    const createdPollData = {
      pollID: newPoll[0].pollID,
      title: newPoll[0].title,
      question: newPoll[0].question,
      start_at: newPoll[0].start_at,
      end_time: newPoll[0].end_time,
      userID: newPoll[0].userID
    };

    res.status(201).json({ poll: createdPollData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating poll' });
  }
});

module.exports = router;
