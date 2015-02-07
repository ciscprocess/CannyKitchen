var recipeProvider = require('../../providers/recipe-provider'),
    q = require('q');

var generate = function(periodLength, fitness) {


  var recipeResult = recipeProvider.randomly(periodLength);

  return recipeResult;
};

module.exports = {
  generate: generate
};
