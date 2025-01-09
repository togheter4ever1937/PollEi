const express = require('express');
const db = require("../db/db.connect");

const deletePollIfNoOptions = async (pollID) => {
  setTimeout(async () => {
    try {
     
      const [poll] = await db.query(
        'SELECT start_at FROM polls WHERE pollID = ?',
        [pollID]
      );

      if (poll.length === 0) {
        console.log(`Poll with ID ${pollID} not found, no action taken.`);
        return;
      }

      const startTime = new Date(poll[0].start_at);
      const now = new Date();

      
      const [options] = await db.query(
        'SELECT COUNT(*) as optionCount FROM Poll_options WHERE pollID = ?',
        [pollID]
      );

      if (options[0].optionCount === 0 && startTime >= now) {
        
        await db.query('DELETE FROM polls WHERE pollID = ?', [pollID]);
        console.log(`Poll with ID ${pollID} has been deleted due to no options and start time >= now.`);
      } else {
        console.log(
          `Poll with ID ${pollID} not deleted. Options exist or start time is not >= now.`
        );
      }
    } catch (error) {
      console.error(`Error checking or deleting poll with ID ${pollID}:`, error);
    }
  }, 30 * 60 * 1000);
};

module.exports = deletePollIfNoOptions;
