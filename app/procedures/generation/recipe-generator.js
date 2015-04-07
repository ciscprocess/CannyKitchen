var recipeProvider = require('../../providers/recipe-provider'),
    parser = require('./ingredient-parser'),
    q = require('q'),
    sampleSize = 100,
    sampleCount = 100,
    sampleMultiplier = 10;

var config = {
  diffPenalty: 100,
  lengthPenalty: 100
};

var sampleError = function(recipes) {
  var cumulativeError = 0.0;
  for (var i = 1; i < sampleCount/2; i++) {
    var sample = _.sample(recipes, 2);
    var d = distance(sample[0], sample[1]);
    cumulativeError += d;
  }
  console.log(cumulativeError);
  return cumulativeError / (sampleCount / 2);
};

var distance = function(r1, r2) {
  var tuples = _.zip(r1.vector, r2.vector);
  return _.reduce(tuples, function(memo, item) { return memo + Math.abs(item[0] - item[1]); }, 0);
};


var generate = function(amount, similarity) {
  similarity = parseFloat(similarity);
  config.diffPenalty = similarity;
  config.lengthPenalty = similarity;

  var recipeResult = recipeProvider.randomly(sampleSize);
  var done = recipeResult.then(function(recipes) {
    var current = _.times(sampleCount * sampleMultiplier, function() {
      return _.times(amount, function() {
        return _.sample(recipes, 1)[0];
      });
    });

    return _.min(current, sampleError);
  });
  return done;
};

module.exports = {
  generate: generate,

  _test: {
    distance: distance
  }
};
