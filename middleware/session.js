const express = require('express');

const router = express.Router();

/**
 * Middleware used by web server.
 * Checks if user is logged in (session is set).
 */
router.use((req, res, next) => {
  if (req.session && req.session.user) {
    req.login = req.session.user.login;
    return next();
  }

  res.redirect('/login');
});

module.exports = router;
