var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'CannyKitchen'
    },
    port: 3000,
    db: 'mongodb://localhost/CannyKitchen-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'CannyKitchen'
    },
    port: 3000,
    db: 'mongodb://localhost/CannyKitchen-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'CannyKitchen'
    },
    port: 3000,
    db: 'mongodb://localhost/CannyKitchen-production'
  }
};

module.exports = config[env];
