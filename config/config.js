var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'strap'
    },
    port: 3000,
    db: 'mongodb://localhost/strap-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'strap'
    },
    port: 3000,
    db: 'mongodb://localhost/strap-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'strap'
    },
    port: 3000,
    db: 'mongodb://localhost/strap-production'
  }
};

module.exports = config[env];
