var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'CannyKitchen'
    },
    provider: {
      ingredient: {
        apiKey: 'e7c4872c62',
        urlTemplate: 'http://www.supermarketapi.com/api.asmx/%s?APIKEY=%s'
      }
    },
    port: 3000,
    //db:'mongodb://localhost/CannyKitchen-development'
     db: 'mongodb://cannykitchen:cs4911@ds041581.mongolab.com:41581/cannykitchen'
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
