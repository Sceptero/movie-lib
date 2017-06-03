const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

const User = require('../api/models/user');
const Movie = require('../api/models/movie');
const ApiError = require('../api/ApiError');
const config = require('../config');
const jwtAuth = require('../middleware/jwt');

/**
 * Generate token.
 */
router.post('/auth', async (req, res, next) => {
  try {
    const user = await User.findOne({ login: req.body.login });

    // user not found
    if (!user) {
      return next(new ApiError((401, 'Bad Credentials')));
    }

    // invalid password
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return next(new ApiError((401, 'Bad Credentials')));
    }

    const token = jwt.sign({ id: user.id }, req.app.get('secret'), { expiresIn: '7d' });
    res.status(200).json({ message: 'Ok', token });
  } catch (err) {
    return next(err);
  }
});

/**
 * Register new user.
 */
router.post('/users', async (req, res, next) => {
  const login = req.body.login;
  const password = req.body.password;

  if (!password) return next(new ApiError(400, 'Input Validation Error'));

  const newUser = new User({
    login,
    password: bcrypt.hashSync(password, 10),
  });

  try {
    const savedUser = await newUser.save();
    res.status(200).json({ message: 'Ok', id: savedUser.id });
  } catch (err) {
    return next(err);
  }
});

/**
 * Delete user.
 *
 * Requires authentication.
 */
router.delete('/users/:id', jwtAuth, async (req, res, next) => {
  try {
    // users can delete only their own account
    if (req.params.id !== req.user.id) return next(new ApiError(403, 'Unathorized'));

    const user = await User.findById(req.params.id);

    if (user) await user.remove();

    res.status(204).json({});
  } catch (err) {
    return next(err);
  }
});

/**
 * Add new movie to user's library
 *
 * Requires authentication.
 */
router.post('/users/:id/movies', jwtAuth, async (req, res, next) => {
  if (req.params.id !== req.user.id) return next(new ApiError(403, 'Unathorized'));

  try {
    const user = await User.findById(req.params.id);

    const movie = new Movie({
      title: req.body.title,
      rating: req.body.rating || 0,
      director: req.body.director,
      actors: req.body.actors,
      category: req.body.category,
    });

    user.movies.push(movie);
    await user.save();

    res.status(200).json({ message: 'Ok', id: movie.id });
  } catch (err) {
    return next(err);
  }
});

/**
 * Get all movies from user's library
 *
 * Requires authentication.
 */
router.get('/users/:id/movies', jwtAuth, async (req, res, next) => {
  if (req.params.id !== req.user.id) return next(new ApiError(403, 'Unathorized'));

  try {
    const user = await User.findById(req.params.id);

    res.status(200).json(user.movies);
  } catch (err) {
    return next(err);
  }
});

/**
 * Get a movie from user's library
 *
 * Requires authentication.
 */
router.get('/users/:id/movies/:movieid', jwtAuth, async (req, res, next) => {
  if (req.params.id !== req.user.id) return next(new ApiError(403, 'Unathorized'));

  try {
    const user = await User.findById(req.params.id);

    const movie = await user.movies.id(req.params.movieid);
    if (!movie) return next(new ApiError(400, 'Invalid Id'));

    res.status(200).json(movie);
  } catch (err) {
    return next(err);
  }
});

/**
 * Update a movie from user's library
 *
 * Requires authentication.
 */
router.patch('/users/:id/movies/:movieid', jwtAuth, async (req, res, next) => {
  if (req.params.id !== req.user.id) return next(new ApiError(403, 'Unathorized'));

  try {
    const user = await User.findById(req.params.id);

    const movie = await user.movies.id(req.params.movieid);
    if (!movie) return next(new ApiError(400, 'Invalid Id'));

    if (req.body.title) movie.title = req.body.title;
    if (req.body.rating) movie.rating = req.body.rating;
    if (req.body.director) movie.director = req.body.director;
    if (req.body.actors) movie.actors = req.body.actors;
    if (req.body.category) movie.category = req.body.category;

    await user.save();

    res.status(200).json(movie);
  } catch (err) {
    return next(err);
  }
});

/**
 * Delete a movie from user's library
 *
 * Requires authentication.
 */
router.delete('/users/:id/movies/:movieid', jwtAuth, async (req, res, next) => {
  if (req.params.id !== req.user.id) return next(new ApiError(403, 'Unathorized'));

  try {
    const user = await User.findById(req.params.id);

    const movie = await user.movies.id(req.params.movieid);
    if (movie) {
      await movie.remove();
      await user.save();
    }

    res.status(204).json({});
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
