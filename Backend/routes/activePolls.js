const router = require("express").Router();
const db = require("../db/db.connect");

const authentificated = require("../middlewares/autentificated");

router.get("/activePolls",authentificated, async (req, res) => {
    try {
      const query = "SELECT * FROM polls WHERE end_time > ?";
      const now = new Date();
  
      const [activePolls] = await db.promise().query(query, [now]);
  
      res.status(200).send({
        msg: "Active polls retrieved successfully!",
        polls: activePolls,
      });
    } catch (error) {
      console.error("Error fetching active polls:", error);
      res.status(500).send({ msg: "Error fetching active polls", error });
    }
  });

  
  