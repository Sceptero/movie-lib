const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();

const User = require('../api/models/user');

// user registration
router.post('/users', async (req, res, next) => {
  const login = req.body.login;
  const password = req.body.password;

  if (!password) return next(new Error('Input Validation Error'));

  const newUser = new User({
    login,
    password: bcrypt.hashSync(password, 10),
  });

  try {
    await newUser.save();
    res.json(200, { message: 'Ok' });
  } catch (err) {
    return next(err);
  }
});

// user deletion
router.delete('/users/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    await user.remove();
    res.json(200, { message: 'Ok' });
  } catch (err) {
    return next(err);
  }
});

// AUTH

// MOVIE

module.exports = router;
