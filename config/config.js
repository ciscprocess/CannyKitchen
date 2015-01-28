var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'cannykitchen'
    },
    port: 3000,
    db: 'mongodb://localhost/cannykitchen-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'cannykitchen'
    },
    port: 3000,
    db: 'mongodb://localhost/cannykitchen-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'cannykitchen'
    },
    port: 3000,
    db: 'mongodb://localhost/cannykitchen-production'
  }
};

module.exports = config[env];
