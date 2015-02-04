var util = require('util'),
    request = require('request'),
    config = require('../../config/config.js').provider.ingredient,
    parseString = require('xml2js').parseString;

var getByName = function(name) {
  var url = util.format(config.urlTemplate, 'SearchByProductName', config.apiKey) + '&ItemName=' + name;

  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      parseString(body, function(err, result) {
        var thing  = result;
      });
    }
  });

};

module.exports = {
  byName: getByName
};