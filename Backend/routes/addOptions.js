const router = require("express").Router();
const db = require("../db/db.connect");
const checkEmptyFields = require("../middlewares/checkEmptyFields");
const authentificated = require("../middlewares/autentificated");

router.post("/addOptions", authentificated, checkEmptyFields, async (req, res) => {
    const { pollID, options } = req.body; 
  
   
    if (!pollID || !options || !Array.isArray(options) || options.length === 0 || options.length > 10) {
      return res.status(400).send({ msg: "Poll ID and options are required, and options must be non-empty and have a maximum of 10 options" });
    }
  
   
    db.query("SELECT * FROM polls WHERE pollID = ?", [pollID], (err, result) => {
      if (err) {
        console.error("Error fetching poll:", err);
        return res.status(500).send({ msg: "Error fetching poll", error: err });
      }
  
      if (result.length === 0) {
        return res.status(404).send({ msg: "Poll not found!" });
      }
  
    
      const query = `
        INSERT INTO Poll_options (content, pollID) 
        VALUES ${options.map(() => "(?, ?)").join(", ")}
      `;
      const values = options.flatMap((option) => [option, pollID]);
  
      db.query(query, values, (err, result) => {
        if (err) {
          console.error("Error adding options:", err);
          return res.status(500).send({ msg: "Error adding options", error: err });
        }
  
        res.status(201).send({
          msg: "Options added successfully!",
          options: options.map((content, index) => ({
            optionID: result.insertId + index, 
            content,
            pollID,
          })),
        });
      });
    });
  });
  
  module.exports = router;