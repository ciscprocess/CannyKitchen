var recipeProvider = require('../../providers/recipe-provider'),
    parser = require('./ingredient-parser'),
    q = require('q'),
    sampleSize = 3000;

var config = {
  maxSimilarity: 20
};

var derivedSigmoid = function(x) {
  x = (x - config.maxSimilarity) / 100;
  return 4 * Math.exp(x) / ((1 + Math.exp(x)) * (1 + Math.exp(x)));
};

var distance = function(r1, r2) {
  var tuples = _.zip(r1.vector, r2.vector);
  var raw = _.reduce(tuples, function(memo, item) {
    return memo + Math.abs(item[0] - item[1]);
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

  var vectorSubtract = function(v1, v2) {
    var tuples = _.zip(v1, v2);
    return _.map(tuples, function(tuple) {
      return tuple[0] - tuple[1];
    });
  };

  var slogVector = function(v1) {
    return _.map(v1, function(comp) {
      return comp >= 0 ? comp : 0;
    });
  };


  var done = vectorizationResult.then(function(vector) {
    return recipeResult.then(function(recipes) {
      var current = _.times(amount, function() {
        return _.sample(recipes, 1)[0];
      });


      var fitness = function() {
        var error = 0;
        var cumVector = vector;
        // calculate the total pairwise error for the current set
        _.each(current, function(item) {
          _.each(current, function(item2) {
            error += distance(item, item2);
          });

          cumVector = vectorSubtract(cumVector, item.vector);
        });

        cumVector = slogVector(cumVector);

        error -= _.reduce(cumVector, function(memo, num){ return memo + num; }, 0) * 10;

        error /= 2;

        return error;
      };

      var sumDistance = function(r, index) {
        var dist = 0;
        var cumVector = vector;
        cumVector = vectorSubtract(cumVector, r.vector);
        for (var i = 0; i < current.length; i++) {
          if (i === index) continue;
          var delta = distance(r, current[i]);
          cumVector = vectorSubtract(cumVector, current[i].vector);
          dist += delta;
        }

        cumVector = slogVector(cumVector);

        dist -= _.reduce(cumVector, function(memo, num){ return memo + num; }, 0) * 10;
        console.log(dist);
        return dist;
      };

      for (var iter = 0; iter < 4; iter++) {
        for (var r = 0; r < current.length; r++) {
          var candidate = _.max(recipes, function(recip) { return sumDistance(recip, r); });
          current[r] = candidate;
        }
      }


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
