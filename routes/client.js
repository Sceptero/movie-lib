const express = require('express');
const session = require('express-session');
const axios = require('axios');

const loginRequired = require('../middleware/session');
const config = require('../config');
const categories = require('../api/categories');

const router = express.Router();

router.use(session({
  secret: config.secret,
  resave: false,
  saveUninitialized: false,
}));

/**
 * Get home page.
 */
router.get('/', loginRequired, async (req, res, next) => {
  try {
    const result = await axios(`http://localhost:3000/api/users/${req.session.user.id}/movies`, {
      headers: {
        Authorization: `Bearer ${req.session.user.token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    const movies = result.data;

    if (req.query.sort === 'category') {
      movies.sort((a, b) => a.category > b.category);
    } else if (req.query.sort === 'rating') {
      movies.sort((a, b) => a.rating < b.rating);
    }

    res.render('index', { title: 'Movie Library', login: req.login, movies });
  } catch (err) {
    return next(err);
  }
});

/**
 * Get new movie page.
 */
router.get('/add-movie', loginRequired, async (req, res, next) => {
  res.render('addmovie', { title: 'Add Movie', login: req.login, categories });
});

/**
 * New movie action.
 */
router.post('/add-movie', loginRequired, async (req, res, next) => {
  try {
    const result = await axios(`http://localhost:3000/api/users/${req.session.user.id}/movies`, {
      method: 'post',
      headers: {
        Authorization: `Bearer ${req.session.user.token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      data: {
        title: req.body.title,
        rating: req.body.rating,
        director: req.body.director,
        actors: req.body.actors.split(',').map(x => x.trim()),
        category: req.body.category,
      },
    });

    res.json({ message: 'Ok' });
  } catch (err) {
    return next(err);
  }
});

/**
 * Get single movie page.
 */
router.get('/movie/:id', loginRequired, async (req, res, next) => {
  try {
    const result = await axios(`http://localhost:3000/api/users/${req.session.user.id}/movies/${req.params.id}`, {
      headers: {
        Authorization: `Bearer ${req.session.user.token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    res.render('movie', { title: 'Edit Movie', login: req.login, movie: result.data, categories });
  } catch (err) {
    return next(err);
  }
});

/**
 * Update movie action.
 */
router.patch('/movie/:id', loginRequired, async (req, res, next) => {
  try {
    const result = await axios(`http://localhost:3000/api/users/${req.session.user.id}/movies/${req.params.id}`, {
      method: 'patch',
      headers: {
        Authorization: `Bearer ${req.session.user.token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      data: {
        title: req.body.title,
        rating: req.body.rating,
        director: req.body.director,
        actors: req.body.actors.split(',').map(x => x.trim()),
        category: req.body.category,
      },
    });

    res.json({ message: 'Ok' });
  } catch (err) {
    return next(err);
  }
});

/**
 * Remove movie action.
 */
router.delete('/movie/:id', loginRequired, async (req, res, next) => {
  try {
    const result = await axios(`http://localhost:3000/api/users/${req.session.user.id}/movies/${req.params.id}`, {
      method: 'delete',
      headers: {
        Authorization: `Bearer ${req.session.user.token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    res.json({ message: 'Ok' });
  } catch (err) {
    return next(err);
  }
});

/**
 * Get login page.
 */
router.get('/login', (req, res) => {
  if (req.session.user) res.redirect('/');

  res.render('login', { title: 'Login', login: req.login });
});

/**
 * Login action.
 */
router.post('/login', async (req, res, next) => {
  try {
    const result = await axios('http://localhost:3000/api/auth', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      data: {
        login: req.body.login,
        password: req.body.password,
      },
    });

    const sess = req.session;
    sess.user = {};
    sess.user.token = result.data.token;
    sess.user.id = result.data.id;
    sess.user.login = result.data.login;

    res.json({ message: 'Ok' });
  } catch (err) {
    return next(err);
  }
});


/**
 * Get register page.
 */
router.get('/register', (req, res) => {
  if (req.session.user) res.redirect('/');

  res.render('register', { title: 'Register', login: req.login });
});

/**
 * Register action.
 */
router.post('/register', async (req, res, next) => {
  try {
    const result = await axios('http://localhost:3000/api/users', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      data: {
        login: req.body.login,
        password: req.body.password,
      },
    });

    res.json({ message: 'Ok' });
  } catch (err) {
    return next(err);
  }
});


/**
 * Logout (destroy session).
 */
router.post('/logout', async (req, res) => {
  req.session.destroy();
  res.json({ message: 'Ok' });
});

module.exports = router;
