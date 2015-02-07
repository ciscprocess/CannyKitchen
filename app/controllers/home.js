var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Article = mongoose.model('Article'),
    extend = require('extend');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  Article.find(function (err, articles) {
    if (err) return next(err);
    res.render('index', {
      title: 'Home'
    });
  });
});

router.get('/login', function (req, res) {
  res.render('login', {
    title: 'Login'
  });
});

router.get('/signup', function (req, res) {
    res.render('signup', {
      title: 'Signup'
    });
});

router.get('/about', function(req, res) {
  res.render('about', {
    title: 'About'
  });
});