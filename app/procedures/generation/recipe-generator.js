var recipeProvider = require('../../providers/recipe-provider'),
    parser = require('./ingredient-parser'),
    q = require('q');

var generate = function(periodLength, fitness) {
  var recipeResult = recipeProvider.randomly(periodLength);
  var done = recipeResult.then(function(recipes) {
    return recipes;

    return recipes;
  });
  return done;
};

module.exports = {
  generate: generate
};
