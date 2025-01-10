const router = require('express').Router();
const db = require('../db/db.connect');
const authentificated = require('../middlewares/autentificated');
const alreadyVotedOrOwner = require('../middlewares/alreadyVotedOrOwner');


router.get('/getVotes/:pollID', authentificated,alreadyVotedOrOwner, async (req, res) => {
    const pollID = req.params.pollID;

    try {
      // Get the total number of votes for this poll
      const [totalVotesResult] = await db.query('SELECT COUNT(*) AS totalVotes FROM votes WHERE pollID = ?', [pollID]);
      const totalVotes = totalVotesResult[0].totalVotes;
      console.log('Total Votes:', totalVotes); // Debugging line

      if (totalVotes === 0) {
        return res.status(404).json({ message: 'No votes found' });
      }

      // Get the count of votes per option
      const [voteCounts] = await db.query(
        'SELECT optionID, COUNT(*) AS voteCount FROM votes WHERE pollID = ? GROUP BY optionID',
        [pollID]
      );
      console.log('Vote Counts:', voteCounts); // Debugging line

      // Get the options for the poll
      const [options] = await db.query('SELECT * FROM Poll_options WHERE pollID = ?', [pollID]);
      console.log('Poll Options:', options); // Debugging line

      // Calculate the percentage for each option
      const optionsWithPercentages = options.map(option => {
        // Find the vote count for this option
        const voteCountObj = voteCounts.find(vote => vote.optionID === option.optionID);
        const voteCount = voteCountObj ? voteCountObj.voteCount : 0; // Default to 0 if not found
        const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0; // Handle division by 0
        return { ...option, voteCount, percentage: percentage.toFixed(2)}; // Round percentage to 2 decimal places
      });

      console.log('Options with Percentages:', optionsWithPercentages); // Debugging line

      // Return the combined options with percentages
      res.status(200).json({ options: optionsWithPercentages, userStatus: req.userStatus });
    } catch (error) {
      console.error('Error fetching votes:', error);
      res.status(500).json({ message: 'Error fetching votes' });
    }
});


module.exports = router;
