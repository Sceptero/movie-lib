const mongoose = require('mongoose');
const categories = require('../categories');

const Schema = mongoose.Schema;

module.exports = mongoose.model('Movie', new Schema({
  id: { type: String, required: true, index: { unique: true, sparse: true } },
  title: { type: String, match: /^[^\W\d]{3,50}$/ }, // 3-50 characters, letters only
  rating: { type: Number, min: 0, max: 5 },
  director: String,
  actors: [String],
  category: { type: String, enum: categories },
  createdAt: { type: Date, default: Date.now },
}));
