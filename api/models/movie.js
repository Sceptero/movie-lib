const mongoose = require('mongoose');
const categories = require('../categories');

const Schema = mongoose.Schema;

module.exports = mongoose.model('Movie', new Schema({
  title: { type: String, match: /^[a-ząćęłńóśźż -]{3,50}$/i, required: true }, // 3-50 characters, letters only (with exception of spaces and dashes)
  rating: { type: Number, min: 1, max: 5, required: true },
  director: { type: String, required: true },
  actors: { type: [String], required: true },
  category: { type: String, enum: categories, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
}));
