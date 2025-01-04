const express = require("express");

//middlware to check if the fields sent from the front aren't empty !
function checkEmptyFildes(req, res, next) {
  const { name, password, email } = req.body;
  if (!name || !password || !email) {
    //console.log("please fill out all the fields");
    res.send("please fill out all the fields");
  }
  next();
}

module.exports = checkEmptyFildes;
