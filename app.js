const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const client = require('./routes/client');
const api = require('./routes/api');

const app = express();

// connect to mongodb
mongoose.Promise = global.Promise; // use ES6 Promise implementation
mongoose.connect(process.env.MOVIE_LIB_DB);

// config
app.set('secret', process.env.MOVIE_LIB_SECRET);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// routers
app.use('/', client);
app.use('/api', api);

// error handlers
require('./middleware/errors')(app);

module.exports = app;
