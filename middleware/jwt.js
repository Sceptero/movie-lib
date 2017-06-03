const express = require('express');
const jwt = require('jsonwebtoken');

const ApiError = require('../api/ApiError');
const User = require('../api/models/user');

const router = express.Router();

/**
 * Validates jsonwebtoken passed in request header.
 * Header format:
 *
 * Key              Value
 * Authorization    Bearer TOKEN
 *
 * attaches decoded payload to request object.
 */
router.use(async (req, res, next) => {
  const secret = req.app.get('secret');
  if (!secret) {
    return next(new Error('secret not set'));
  }

  if (!(req.headers && req.headers.authorization)) {
    return next(new ApiError(401, 'Auth Error'));
  }

  const parts = req.headers.authorization.split(' ');
  if (parts.length !== 2) {
    return next(new ApiError(401, 'Auth Error'));
  }

  const scheme = parts[0];
  const token = parts[1];
  if (!/^Bearer$/i.test(scheme)) {
    return next(new ApiError(401, 'Auth Error'));
  }

  try {
    const decoded = jwt.verify(token, secret);

    // make sure user exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new ApiError(401, 'Auth Error'));
    }

    req.user = decoded;
    next();
  } catch (err) {
    return next(new ApiError(401, 'Auth Error'));
  }
});

module.exports = router;
