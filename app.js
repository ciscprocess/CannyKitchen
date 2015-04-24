var express = require('express'),
    config = require('./config/config'),
    glob = require('glob'),
    mongoose = require('mongoose'),
    swig = require('swig'),
    session = require('express-session');

// setting global libraries
GLOBAL._ = require('underscore');

swig.setDefaults({
    locals: {
      config: config
    }
});

mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

var models = glob.sync(config.root + '/app/models/*.js');

models.forEach(function (model) {
  require(model);
});

var app = express();
app.use(session({
	secret: 'secretkey',
	resave: false,
	saveUninitialized: false
}));

require('./config/express')(app, config);

app.listen((process.env.PORT || config.port));

