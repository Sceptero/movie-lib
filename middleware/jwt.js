const express = require('express');
const jwt = require('jsonwebtoken');

const ApiError = require('../api/ApiError');

const router = express.Router();

/**
 * validates jsonwebtoken passed in request body,
 * attaches decoded payload to request object
 */
router.use((req, res, next) => {
  const secret = req.app.get('secret');
  if (!secret) {
    return next(new Error('secret not set'));
  }

  const token = req.body.token;
  if (!token) {
    return next(new ApiError(401, 'Auth Error'));
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    return next(new ApiError(401, 'Auth Error'));
  }
});

module.exports = router;
