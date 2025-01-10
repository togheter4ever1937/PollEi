const db = require("../db/db.connect");

const deletePollIfNoOptions = async (pollID) => {
  try {
    // Fetch poll details
    const [polls] = await db.query(
      'SELECT start_at FROM polls WHERE pollID = ?',
      [pollID]
    );

    if (polls.length === 0) {
      console.log(`Poll with ID ${pollID} not found, no action taken.`);
      return;
    }

    const startTime = new Date(polls[0].start_at);
    const now = new Date();

    // Fetch options count for the poll
    const [options] = await db.query(
      'SELECT COUNT(*) as optionCount FROM Poll_options WHERE pollID = ?',
      [pollID]
    );

    const optionCount = options[0].optionCount;
    console.log(`Poll with ID ${pollID} has ${optionCount} options.`);

    // Immediate check: delete if startTime > now and no options
    if (startTime > now && optionCount === 0) {
      await db.query('DELETE FROM polls WHERE pollID = ?', [pollID]);
      console.log(`Poll with ID ${pollID} deleted immediately (startTime > now, no options).`);
      return;
    }

    // If startTime is still in the future, set a timeout for 30 minutes
    if (startTime > now) {
      console.log(`Poll with ID ${pollID} has start time in the future, setting timeout.`);
      setTimeout(async () => {
        try {
          // Check options again after 30 minutes
          const [optionsAfterTimeout] = await db.query(
            'SELECT COUNT(*) as optionCount FROM Poll_options WHERE pollID = ?',
            [pollID]
          );

          if (optionsAfterTimeout[0].optionCount === 0) {
            await db.query('DELETE FROM polls WHERE pollID = ?', [pollID]);
            console.log(`Poll with ID ${pollID} deleted after timeout (no options).`);
          } else {
            console.log(`Poll with ID ${pollID} not deleted after timeout (options exist).`);
          }
        } catch (error) {
          console.error(`Error during timeout check for poll with ID ${pollID}:`, error);
        }
      }, 30 * 60 * 1000); // 30-minute timeout
    } else {
      console.log(`Poll with ID ${pollID} has already started (startTime <= now), no timeout needed.`);
    }
  } catch (error) {
    console.error(`Error checking or deleting poll with ID ${pollID}:`, error);
  }
};

module.exports = deletePollIfNoOptions;
