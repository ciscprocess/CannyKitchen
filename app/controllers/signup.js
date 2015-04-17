var express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	bcrypt = require('bcrypt');
var sess;

module.exports = function (app) {
	app.use('/', router);
};


router.post('/signup', function (req, res) {
	sess = req.session;	
  	var email = req.body.email;
  	var username = req.body.username;
  	var pw = req.body.password;
  	var cpw = req.body.cfmpassword;
    User.findOne({$or:[{'username' : username}, {'email' : email}]}, function (err, doc) {
  	// User.findOne({'email' : email}, function (err, doc) {
    	if (doc) {
        if (doc.email === email) {
          res.render('signup', {alert: "yes", msg: "Email already taken."});
        } else {
          res.render('signup', {alert: "yes", msg: "Username already taken."});
        }
    	} else if (pw != cpw) {
      		res.render('signup', {alert: "yes", msg: "Passwords do not match."});
    	} else {
      		var hash = bcrypt.hashSync(pw, 10);
      		var newUser = new User({username: username, email: email, password: hash});
      		newUser.save(function (err) {
        		if (err) res.send('Error.');
        		sess.username = username;
        		res.redirect('/');
            	// res.send('Success.');
      		});
    	}
  	});
});