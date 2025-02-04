const router = require("express").Router();
const db = require("../db/db.connect");
const checkEmptyFields = require("../middlewares/checkEmptyFields");
const authentificated = require("../middlewares/autentificated");
const checkDuplicateOptions = require("../middlewares/checkDuplicateOptions");
const checkOptionsLength = require("../middlewares/checkOptionsLength");

router.post('/addOptions', authentificated,checkDuplicateOptions,checkOptionsLength, async (req, res) => {
  const { pollID, options } = req.body;
  console.log(pollID, options);

  if (!pollID || !Array.isArray(options) || options.length === 0) {
    return res.status(400).json({ message: 'Invalid data. Please provide a pollID and a list of options.' });
  }

  try {
    const [pollResults] = await db.query('SELECT * FROM polls WHERE pollID = ?', [pollID]);

    if (pollResults.length === 0) {
      return res.status(404).json({ message: 'Poll not found.' });
    }

    
    const insertPromises = options.map(optionContent =>
      db.query('INSERT INTO Poll_options (content, pollID) VALUES (?, ?)', [optionContent, pollID])
    );

    await Promise.all(insertPromises);

    return res.status(201).json({ message: 'Options added successfully!' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error, please try again later.' });
  }
});


module.exports = router;
