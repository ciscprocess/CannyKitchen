var util = require('util'),
    request = require('request'),
    config = require('../../config/config.js').provider.ingredient,
    parseString = require('xml2js').parseString,
    q = require('q');

var requestByName = function(name) {
  var url = util.format(config.urlTemplate, 'SearchByProductName', config.apiKey) + '&ItemName=' + name;

  var deferred = q.defer();

  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      parseString(body, function(err, result) {
        if (err) {
          deferred.reject(err);
        } else {
          deferred.resolve(result);
        }
      });
    } else {
      deferred.reject(error);
    }
  });

  return deferred.promise;
};

module.exports = {
  byName: requestByName
};