var express = require('express'),
    router = express.Router();

module.exports = function (app) {
  app.use('/', router);

  app.use(function(req, res){
    res.status(404);

    // respond with html page
    if (req.accepts('html')) {
      res.render('http-404', {
        message: 'Unfortunately, it seems that the page you have requested does not exist!',
        error: {

        }
      });
      return;
    }

    // respond with json
    if (req.accepts('json')) {
      res.send({ error: 'Not found' });
      return;
    }

    // default to plain-text. send()
    res.type('txt').send('Not found');
  });
};