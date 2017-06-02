const mongoose = require('mongoose');
const Movie = require('./movie');

const Schema = mongoose.Schema;

module.exports = mongoose.model('User', new Schema({
  login: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  movies: [Movie.schema],
}));
