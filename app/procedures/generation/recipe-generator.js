var recipeProvider = require('../../providers/recipe-provider'),
    parser = require('./ingredient-parser'),
    q = require('q'),
    sampleSize = 100,
    sampleCount = 100;

var ingredDist = function(i1, i2) {
  var dist = 0.0;
  for (var i = 0; i < Math.min(i1.length, i2.length); i++) {
    var first = i1[i], second = i2[i];
    if (first._id.valueOf() == second._id.valueOf()) {
      dist += Math.abs(first.amount - second.amount);
    } else {
      dist += (first.amount + second.amount) * 100;
    }
  }

  return dist;
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

var distance = function(r1, r2, sampleCount) {
  sampleCount = (sampleCount || 20);
  var penalty = r1._id.valueOf() == r2._id.valueOf() ? 100 : 0;
  var lengthDiff = Math.abs(r1.ingredients.length - r2.ingredients.length);
  var editSize = Math.min(r1.ingredients.length, r2.ingredients.length);
  var poolSize = Math.max(r1.ingredients.length, r2.ingredients.length);
  var larger = r1.ingredients.length > r2.ingredients.length ? r1 : r2;
  var smaller = r1.ingredients.length <= r2.ingredients.length ? r1 : r2;
  var samples = [];

  for (var i = 0; i < sampleCount/2; i++) {
    samples.push(_.sample(larger.ingredients, editSize));
  }

  var numerator = 0.0;
  _.each(samples, function(sample) {
    var d = ingredDist(sample, smaller.ingredients);
    numerator += d;
  });

  return lengthDiff + numerator / samples.length + penalty;
};

var generate = function(amount) {
  var recipeResult = recipeProvider.randomly(sampleSize);
  var done = recipeResult.then(function(recipes) {


    var current = _.times(sampleCount * 40, function() {
      return _.times(amount, function() {
        return _.sample(recipes, 1)[0];
      });
    });

    var m;
    try {
      m = _.min(current, sampleError);
    } catch (ex) {
      console.log(ex);
    }

    return m;
  });
  return done;
};

module.exports = {
  generate: generate
};
