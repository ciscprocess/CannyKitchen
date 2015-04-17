var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    swig = require('swig');
    /*bcrypt = require('bcrypt');*/
var sess;

module.exports = function (app) {
  app.use('/', router);
};

swig.setDefaults({ cache: false });

router.get('/', function (req, res, next) {
  sess = req.session;
  res.render('index', {
    name: sess.username,
    title: 'Home'
  });
});

router.get('/login', function (req, res) {
  res.render('login', {
    title: 'Login'
  });
});

router.get('/logout', function (req, res) {
  req.session.destroy();
  res.redirect('/');
});

router.get('/signup', function (req, res) {
    res.render('signup', {
      title: 'Signup'
    });
});

router.get('/about', function(req, res) {
  sess = req.session;
  res.render('about', {
    name: sess.username,
    title: 'About'
  });
});

router.get('/contact', function(req, res) {
  sess = req.session;
  res.render('contact', {
    name: sess.username,
    title: 'Contact Us'
  });
});