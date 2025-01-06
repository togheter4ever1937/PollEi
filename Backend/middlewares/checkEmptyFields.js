const express = require("express");


function checkEmptyFieldes(req, res, next) {
  const { name, password, email } = req.body;
  if (!name || !password || !email) {
    
    res.send("please fill out all the fields");
  }
  next();
};


module.exports = checkEmptyFieldes;
