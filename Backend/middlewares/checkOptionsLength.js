const express = require('express');

const checkDuplicateOptions = (req, res, next) => {
    const { options } = req.body;
  
    if (!Array.isArray(options)) {
      return res.status(400).json({ message: 'Options must be an array.' });
    }
  
    if (options.length < 2 || options.length > 10) {
      return res.status(400).json({ message: 'The options list must contain between 2 and 10 options.' });
    }
  
    next();
  };

  module.exports = checkDuplicateOptions;