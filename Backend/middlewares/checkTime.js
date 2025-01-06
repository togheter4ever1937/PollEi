const express = require('express');

const checkTime = (req, res, next) => {
    const { startTime, endTime } = req.body;
  
    
    if (!startTime || !endTime) {
      return res.status(400).send({ msg: "startTime and endTime are required!" });
    }
  
    
    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();
  
    
    if (isNaN(start.getTime()) || start <= now) {
      return res.status(400).send({ msg: "startTime must be a valid date and in the future!" });
    }
  
    
    if (isNaN(end.getTime()) || end <= start) {
      return res.status(400).send({ msg: "endTime must be a valid date and greater than startTime!" });
    }
  
    
    const durationInMinutes = (end - start) / (1000 * 60); 
    if (durationInMinutes < 30) {
      return res.status(400).send({ msg: "The duration between startTime and endTime must be at least 30 minutes!" });
    }
  
    
    next();
  };
  
  module.exports = checkTime;
  