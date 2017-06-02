const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtAuth = require('express-jwt');

const router = express.Router();

const User = require('../api/models/user');
const ApiError = require('../api/ApiError');

// user registration
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

// user deletion
router.delete('/users/:id', jwtAuth({ secret: 'test' }), async (req, res, next) => {
  try {
    // only logged in user can remove his account
    if (req.params.id !== req.user.id) return next(new ApiError(401, 'Unathorized'));

    const user = await User.findById(req.params.id);

    if (user) await user.remove();

    res.status(204).json({});
  } catch (err) {
    if (err.name === 'CastError') return next(new ApiError(400, 'Invalid Id'));
    return next(err);
  }
});

// AUTH
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

    const token = jwt.sign(user, req.app.get('secret'), { expiresIn: '7d' });
    res.status(200).json({ message: 'Ok', token });
  } catch (err) {
    return next(err);
  }
});


// MOVIE

module.exports = router;
