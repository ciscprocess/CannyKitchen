var recipeProvider = require('../../providers/recipe-provider'),
    parser = require('./ingredient-parser'),
    q = require('q');

var generate = function(periodLength, fitness) {
  var recipeResult = recipeProvider.randomly(periodLength);
  parser.parseDescriptor();
  return recipeResult;
};

module.exports = {
  generate: generate
};
