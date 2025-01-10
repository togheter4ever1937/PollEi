const router = require("express").Router();
const db = require("../db/db.connect");

const authentificated = require("../middlewares/autentificated");
const checkCreatorVote = require("../middlewares/checkCreatorVote");

router.post("/validateVote", authentificated,checkCreatorVote, async (req, res) => {
    const { pollID, optionID } = req.body;
    const userID = req.userId; 
  
    
    if (!pollID || !optionID) {
      return res.status(400).send({ msg: "pollID and optionID are required!" });
    }
  
    try {
      
      const pollQuery = "SELECT * FROM polls WHERE pollID = ?";
      const [pollResult] = await db.query(pollQuery, [pollID]);
  
      if (pollResult.length === 0) {
        return res.status(404).send({ msg: "Poll not found!" });
      }
  
      
      const optionQuery = "SELECT * FROM Poll_options WHERE optionID = ? AND pollID = ?";
      const [optionResult] = await db.query(optionQuery, [optionID, pollID]);
  
      if (optionResult.length === 0) {
        return res.status(404).send({ msg: "Option not found or not associated with the specified poll!" });
      }
  
      
      const voteQuery = "SELECT * FROM votes WHERE pollID = ? AND userID = ?";
      const [voteResult] = await db.query(voteQuery, [pollID, userID]);
  
      if (voteResult.length > 0) {
        return res.status(400).send({ msg: "You have already voted in this poll!" });
      }
  
      
      const insertVoteQuery = `
        INSERT INTO votes (pollID, userID, optionID, voted_at)
        VALUES (?, ?, ?, ?)
      `;
      const votedAt = new Date();
      const [insertResult] = await db.query(insertVoteQuery, [pollID, userID, optionID, votedAt]);
  
      return res.status(201).send({
        msg: "Vote recorded successfully!",
        vote: {
          voteID: insertResult.insertId,
          pollID,
          userID,
          optionID,
          votedAt,
        },
      });
    } catch (error) {
      console.error("Error validating vote:", error);
      return res.status(500).send({ msg: "Error validating vote", error });
    }
  });
  
module.exports = router;
  