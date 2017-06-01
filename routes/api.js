const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();

const User = require('./api/models/user');

// user registration
router.post('/users', async (req, res) => {
  const login = req.body.login;
  const password = req.body.password;

  const newUser = new User({
    login,
    password: bcrypt.hashSync(password, 10),
  });

  try {
    await newUser.save();
    res.status(200);
    res.json({ Result: 'Ok' });
  } catch (err) {
    switch (err.code) {
      case 11000:
        res.status(409);
        res.json({ Result: 'Already Exists' });
        break;
      default:
        console.error(`Unhandled error: ${err.message}`);
        res.status(500);
        res.json({ Result: 'Internal Server Erro' });
    }
  }
});

// AUTH

// MOVIE

module.exports = router;
