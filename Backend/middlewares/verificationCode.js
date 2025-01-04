function verificationCode(req, res, next) {
  let randomNumbers = [];
  for (let index = 0; index < 4; index++) {
    randomNumbers.push(Math.floor(Math.random() * 10));
  }
  //console.log(randomNumbers);
  req.random = randomNumbers.join("");
  next();
}

module.exports = verificationCode;
