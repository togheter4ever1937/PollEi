const router = require("express").Router();
const db = require("../db/db.connect");

const authentificated = require("../middlewares/autentificated");
const deletePollIfNoOptions = require("../middlewares/deletePollIfNoOptions");

router.get("/activePolls", authentificated, async (req, res) => {
  try {
    const query = "SELECT * FROM polls WHERE end_time > ? AND start_at < ?;";
    const now = new Date();

    const [activePolls] = await db.query(query, [now, now]);

    if (activePolls.length === 0) {
      return res.status(404).send({ msg: "No active polls found!" });
    }

    // Create an array of promises for deleting polls with no options
    const deletePollPromises = activePolls.map(async (poll) => {
      await deletePollIfNoOptions(poll.pollID);
    });

    // Wait for all delete operations to complete
    await Promise.all(deletePollPromises);

    res.status(200).send({
      msg: "Active polls retrieved successfully!",
      polls: activePolls,
    });
  } catch (error) {
    console.error("Error fetching active polls:", error);
    res.status(500).send({ msg: "Error fetching active polls", error });
  }
});

module.exports = router;
