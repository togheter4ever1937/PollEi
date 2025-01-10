const express = require('express');
const db = require('../db/db.connect');

async function checkCreatorVote(req, res, next){
    const { pollID } = req.body;
    const userID = req.userId; 
  
    
    if (!pollID) {
      return res.status(400).send({ msg: "pollID is required!" });
    }
  
    try {
     
      const query = "SELECT userID FROM polls WHERE pollID = ?";
      const [result] = await db.query(query, [pollID]);
  
      if (result.length === 0) {
        return res.status(404).send({ msg: "Poll not found!" });
      }
  
      const pollCreatorID = result[0].userID;
  
     
      if (pollCreatorID === userID) {
        return res.status(403).send({ msg: "The poll creator is not allowed to vote in their own poll!" });
      }
  
      
      next();
    } catch (error) {
      console.error("Error checking poll creator vote:", error);
      return res.status(500).send({ msg: "Internal server error", error });
    }
  };
  
  module.exports = checkCreatorVote;