const express = require('express');
const ApiError = require('../api/ApiError');

const router = express.Router();

router.all((req, res, next) => {
  if (!req.app.get('secret')) {
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
  const credentials = parts[1];
  if (!/^Bearer$/i.test(scheme)) {
    return next(new ApiError(401, 'Auth Error'));
  }

  const token = credentials;
  if (!token) {
    return next(new ApiError(401, 'Auth Error'));
  }

  



});

module.exports = router;
