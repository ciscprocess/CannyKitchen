var express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose'),
	User = mongoose.model('User');
	/*bcrypt = require('bcrypt');*/

var sess;

module.exports = function (app) {
	app.use('/', router);
};

router.post('/login', function (req, res) {
	sess = req.session;
	var username = req.body.username;
	var email = req.body.email;
	var pw = req.body.password;

  	User.findOne({'username' : username}, function (err, user) {
    	if (user) {
      		bcrypt.compare(pw, user.password, function (err, match) {
        		if (match) {
        			sess.username = username;
        			res.redirect('/');
        		} else {
          			res.render('login', {alert: "yes"});
        		}
    		});
    	} else {
      		res.render('login', {alert: "yes"});
    	}
  	});
});