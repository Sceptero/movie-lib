const mongoose = require('mongoose');
const categories = require('../categories');

const Schema = mongoose.Schema;

module.exports = mongoose.model('Movie', new Schema({
  title: { type: String, match: /^[^\W\d]{3,50}$/, required: true }, // 3-50 characters, letters only
  rating: { type: Number, min: 0, max: 5, required: true },
  director: { type: String, required: true },
  actors: { type: [String], required: true },
  category: { type: String, enum: categories, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
}));
