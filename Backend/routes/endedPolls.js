const router = require("express").Router();
const db = require("../db/db.connect");

const authentificated = require("../middlewares/autentificated");


router.get("/endedPolls",authentificated, async (req, res) => {
    try {
      const query = "SELECT * FROM polls WHERE end_time <= ?";
      const now = new Date();
  
      const [endedPolls] = await db.query(query, [now]);
  
      res.status(200).send({
        msg: "Ended polls retrieved successfully!",
        polls: endedPolls,
      });
    } catch (error) {
      console.error("Error fetching ended polls:", error);
      res.status(500).send({ msg: "Error fetching ended polls", error });
    }
  });

  module.exports = router;
  