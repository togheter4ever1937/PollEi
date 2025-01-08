const express = require('express');

const validatePollTime = (req, res, next) => {
  const { start_at, end_time } = req.body;

  if (!start_at || !end_time) {
    return res.status(400).json({ message: 'Start time and end time are required' });
  }

  const startTime = new Date(start_at);
  const endTime = new Date(end_time);
  const now = new Date();

  // Check if start time is in the future or now
  if (startTime < now) {
    return res.status(400).json({ message: 'Start time must be greater than or equal to the current time' });
  }

  // Check if the difference between start time and end time is at least 30 minutes
  const diffInMinutes = (endTime - startTime) / (1000 * 60); // Difference in minutes
  if (diffInMinutes < 30) {
    return res.status(400).json({ message: 'End time must be at least 30 minutes after the start time' });
  }

  next(); // Pass control to the next middleware or route handler
};

module.exports = validatePollTime;