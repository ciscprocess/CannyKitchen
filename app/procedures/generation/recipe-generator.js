var recipeProvider = require('../../providers/recipe-provider'),
    parser = require('./ingredient-parser'),
    q = require('q'),
    sampleSize = 1000;

var config = {
  maxSimilarity: 20
};

var derivedSigmoid = function(x) {
  x = (x - config.maxSimilarity) / 100;
  return 4 * Math.exp(x) / ((1 + Math.exp(x)) * (1 + Math.exp(x)));
};

var distance = function(r1, r2, L) {
  var tuples = _.zip(r1.vector, r2.vector, L);
  var raw = _.reduce(tuples, function(memo, item) {
    return memo + Math.abs(item[0] - item[1] - item[2]);
  }, 0);
  var transformed = derivedSigmoid(raw);

  for (var i = 0; i < tuples.length; i++) {
    transformed += (tuples[i][0] + tuples[i][1]) / 1000;
  }

  return transformed;
};

var generate = function(amount, similarity, desired) {
  similarity = parseFloat(similarity);
  config.maxSimilarity = (100 - similarity) / 4;
  var vectorizationResult =  recipeProvider.ingredientsVector({ingredients: desired});
  var recipeResult = recipeProvider.randomly(sampleSize);

  var done = vectorizationResult.then(function(vector) {
    return recipeResult.then(function(recipes) {
      var current = _.times(amount, function() {
        return _.sample(recipes, 1)[0];
      }), error = 0;

      // calculate the total pairwise error for the current set
      _.each(current, function(item) {
        _.each(current, function(item2) {
          error += distance(item, item2, vector);
        });
      });

      error /= 2;

      var sumDistance = function(r, index) {
        var dist = 0;
        for (var i = 0; i < current.length; i++) {
          if (i === index) continue;
          var delta = distance(r, current[i], vector);
          dist += delta;
        }

        return dist;
      };

      for (var iter = 0; iter < 30; iter++) {
        for (var r = 0; r < current.length; r++) {
          var candidate = _.max(recipes, function(recip) { return sumDistance(recip, r); });
          current[r] = candidate;
        }
      }

      error = 0;
      // calculate the total pairwise error for the current set
      _.each(current, function(item) {
        _.each(current, function(item2) {
          error += distance(item, item2, vector);
        });
      });

      error /= 2;

      return current;
    });
  });

  return done;
};

module.exports = {
  generate: generate,

  _test: {
    distance: distance
  }
};
