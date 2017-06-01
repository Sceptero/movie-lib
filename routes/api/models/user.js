const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('User', new Schema({
    mail: {type: String, unique: true},
    password: String,
    movies: [{
        id: {type: String, unique: true},
        title: String,
        rating: {type: Number, min: 0, max: 5},
        director: String,
        actors: [String],
        category: {type: String, enum: ['Action', 'Adventure', 'Comedy', 'Crime', 'Drama', 'Epics', 'Horror', 'Musical', 'Science Fiction', 'Thriller', 'War', 'Western']},
        createdAt: {type: Date, default: Date.now}
    }]
}));