const express = require('express');
const db = require('../db/db.connect');

const alreadyVotedOrOwner = async (req, res, next) => {
  const userId = req.userId;
  const pollID = req.params.pollID;

  try {
    // Check if user is the owner of the poll
    const poll = await db.query('SELECT userID FROM polls WHERE pollID = ?', [pollID]);
    if (poll && poll.userID === userId) {
      req.userStatus = 'owner';  // Mark as owner
      return next(); // Allow the owner to access the votes
    }

    // Check if the user has voted in this poll
    const vote = await db.query('SELECT * FROM votes WHERE pollID = ? AND userID = ?', [pollID, userId]);
    if (vote.length > 0) {
      req.userStatus = 'voted';  // Mark as voted
      return next(); // User has already voted
    }

    req.userStatus = 'not voted'; // User has not voted
    return res.status(403).json({ msg: 'You cannot access this poll. Either you have voted or are the owner.' });
  } catch (error) {
    console.error('Error checking vote status:', error);
    return res.status(500).json({ msg: 'Internal Server Error' });
  }
};

module.exports = alreadyVotedOrOwner;
