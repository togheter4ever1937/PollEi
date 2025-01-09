const router = require('express').Router();
const db = require("../db/db.connect");
const authentificated = require("../middlewares/autentificated");


router.get('/getOptions/:pollID',authentificated, async (req, res) => {
    const pollID = req.params.pollID;
    console.log(pollID);

    try {
        const [results] = await db.query('SELECT * FROM Poll_options WHERE pollID = ?', [pollID]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'No options found' });
        }

        return res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching options:', error);
        return res.status(500).json({ message: 'Error fetching options' });
    }
});



module.exports = router;
