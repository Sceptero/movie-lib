const express = require('express');
const session = require('express-session');

const loginRequired = require('../middleware/session');
const config = require('../config');

const router = express.Router();

router.use(session({
  secret: config.secret,
  resave: false,
  saveUninitialized: false,
}));

/**
 * Get home page.
 */
router.get('/', loginRequired, (req, res) => {
  res.render('index', { title: 'Home', login: req.login });
});

/**
 * Get login page.
 */
router.get('/login', (req, res) => {
  if (req.session.user) res.redirect('/');

  res.render('login', { title: 'Login', login: req.login });
});


/**
 * Get register page.
 */
router.get('/register', (req, res) => {
  if (req.session.user) res.redirect('/');

  res.render('register', { title: 'Register', login: req.login });
});

/**
 * Login (create sesion).
 */
router.post('/login', (req, res) => {
  const sess = req.session;

  sess.user = {};
  sess.user.token = req.body.token;
  sess.user.id = req.body.id;
  sess.user.login = req.body.login;

  res.json({ message: 'Ok' });
});

/**
 * Logout (destroy session).
 */
router.post('/logout', async (req, res) => {
  req.session.destroy();
  res.json({ message: 'Ok' });
});

module.exports = router;
