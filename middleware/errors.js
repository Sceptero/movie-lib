module.exports = (app) => {
  // api error handler - mongo
  app.use('/api', (err, req, res, next) => {
    if (err.name !== 'MongoError') return next(err);

    switch (err.code) {
      case 11000:
        res.json(409, { message: 'Already Exists' });
        break;
      default:
        console.error(`Unhandled error: ${err.message}`);
        res.json(500, { message: 'Internal Server Error' });
    }
  });

  // api error handler - mongoose
  app.use('/api', (err, req, res, next) => {
    if (err.name !== 'ValidationError') return next(err);

    res.json(400, { message: 'Input Validation Error' });
  });

  // api error handler - unhandled
  app.use('/api', (err, req, res, next) => {
    if (err.message) {
      res.json(400, { message: err.message });
    } else {
      console.error(`Unhandled error: ${err.message}`);
      res.json(500, { message: 'Internal Server Error' });
    }
  });

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // website error handler
  app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);

    if (req.accepts('html')) {
      res.render('error');
    } else {
      res.json(err.status, { message: err.message });
    }
  });
};
