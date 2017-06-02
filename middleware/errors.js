const ApiError = require('../api/ApiError');

module.exports = (app) => {
  // handle mongo errors and pass to next handler
  app.use('/api', (err, req, res, next) => {
    if (err.name !== 'MongoError') return next(err);
    
    let apiError;

    switch (err.code) {
      case 11000:
        apiError = new ApiError(409, 'Already Exists');
        break;
      default:
        return next(err);
    }

    next(apiError);
  });

  // handle mongoose errors and pass to next handler
  app.use('/api', (err, req, res, next) => {
    if (err.name !== 'ValidationError') return next(err);

    return next(new ApiError(400, 'Input Validation Error'));
  });

  // api error handler - unhandled
  app.use('/api', (err, req, res, next) => {
    if (err instanceof ApiError) {
      res.status(err.status).json({ message: err.message });
    } else {
      console.error(`Unhandled error: ${err.message}`);
      res.status(500).json({ message: 'Internal Server Error' });
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
      res.status(err.status).json({ message: err.message });
    }
  });
};
