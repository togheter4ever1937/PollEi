const express = require('express');

const checkDuplicateOptions = (req, res, next) => {
    const { options } = req.body;
  
    if (!Array.isArray(options)) {
      return res.status(400).json({ message: 'Invalid data. Options must be an array.' });
    }
  
  
    const uniqueOptions = new Set(options);
    if (uniqueOptions.size !== options.length) {
      return res.status(400).json({ message: 'Duplicate options found. Please provide unique options.' });
    }
  
    next();
  };

  module.exports = checkDuplicateOptions;