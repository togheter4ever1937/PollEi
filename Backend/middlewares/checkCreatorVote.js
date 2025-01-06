const express = require('express');

async function checkCreatorVote(req, res, next){
    const { pollID } = req.body;
    const userID = req.userId; // Assuming `userId` is set by the `authentificated` middleware
  
    // Validate that pollID is provided
    if (!pollID) {
      return res.status(400).send({ msg: "pollID is required!" });
    }
  
    try {
      // Check if the user is the creator of the poll
      const query = "SELECT userID FROM polls WHERE pollID = ?";
      const [result] = await db.promise().query(query, [pollID]);
  
      if (result.length === 0) {
        return res.status(404).send({ msg: "Poll not found!" });
      }
  
      const pollCreatorID = result[0].userID;
  
      // If the authenticated user is the poll creator, deny access
      if (pollCreatorID === userID) {
        return res.status(403).send({ msg: "The poll creator is not allowed to vote in their own poll!" });
      }
  
      // If the user is not the poll creator, proceed
      next();
    } catch (error) {
      console.error("Error checking poll creator vote:", error);
      return res.status(500).send({ msg: "Internal server error", error });
    }
  };
  
  module.exports = checkCreatorVote;