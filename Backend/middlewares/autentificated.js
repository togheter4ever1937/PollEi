const jwt = require("jsonwebtoken");
const { use } = require("../routes/login");
require("dotenv").config();

function authenticated(req, res, next) {
  const loginHeader = req.headers["authorization"];
  const jwtToken = loginHeader && loginHeader.split(" ")[1];



  if (!jwtToken) {
    return res.status(401).send({ msg: "Access denied, please login!" });
  }

  jwt.verify(jwtToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("Error verifying JWT: ", err);
      return res.status(402).send({ msg: `${err.message}` });
    }
    req.userId = decoded.id; 
    console.log("userID from middl : " , decoded.id);    
    next();
  });
}

module.exports = authenticated;
