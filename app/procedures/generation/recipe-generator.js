var recipeProvider = require('../../providers/recipe-provider'),
    parser = require('./ingredient-parser'),
    q = require('q'),
    sampleSize = 100,
    sampleCount = 100,
    sampleMultiplier = 10;

var config = {
  maxSimilarity: 20
};

var derivedSigmoid = function(x) {
  x = (x - config.maxSimilarity) / 100;
  return 4 * Math.exp(x) / ((1 + Math.exp(x)) * (1 + Math.exp(x)));
};

var distance = function(r1, r2) {
  var tuples = _.zip(r1.vector, r2.vector);
  var raw = _.reduce(tuples, function(memo, item) { return memo + Math.abs(item[0] - item[1]); }, 0);
  var transformed = derivedSigmoid(raw);
  return transformed;
};

var generate = function(amount, similarity) {
  similarity = parseFloat(similarity);
  config.maxSimilarity = (100 - similarity) / 4;

  var recipeResult = recipeProvider.randomly(sampleSize);
  var done = recipeResult.then(function(recipes) {
    var current = _.times(amount, function() {
      return _.sample(recipes, 1)[0];
    }), error = 0;

    // calculate the total pairwise error for the current set
    _.each(current, function(item) {
      _.each(current, function(item2) {
        error += distance(item, item2);
      });
    });

    error /= 2;

    var sumDistance = function(r, index) {
      var dist = 0;
      for (var i = 0; i < current.length; i++) {
        if (i === index) continue;
        var delta = distance(r, current[i]);
        dist += delta;
      }

      return dist;
    };

    for (var iter = 0; iter < 50; iter++) {
      for (var r = 0; r < current.length; r++) {
        var candidate = _.max(recipes, function(recip) { return sumDistance(recip, r); });
        current[r] = candidate;
      }
    }

    error = 0;
    // calculate the total pairwise error for the current set
    _.each(current, function(item) {
      _.each(current, function(item2) {
        error += distance(item, item2);
      });
    });

    error /= 2;

    return current;
  });
  return done;
};

module.exports = {
  generate: generate,

  _test: {
    distance: distance
  }
};
