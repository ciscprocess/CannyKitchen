var util = require('util'),
    request = require('request'),
    config = require('../../config/config.js').provider.ingredient,
    parseString = require('xml2js').parseString,
    q = require('q');

var requestByName = function(name) {

};

module.exports = {
  byName: requestByName
};