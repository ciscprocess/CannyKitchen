var express = require('express'),
    router = express.Router();

module.exports = function (app) {
  app.use('/', router);
};

router.get('/api/recipes', function (req, res, next) {
  res.render('login', {
    title: 'Login'
  });
});