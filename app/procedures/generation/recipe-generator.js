var recipeProvider = require('../../providers/recipe-provider'),
    parser = require('./ingredient-parser'),
    q = require('q'),
    sampleSize = 100,
    sampleCount = 100;

var config = {
  diffPenalty: 100,
  lengthPenalty: 100
};

var ingredDist = function(i1, i2) {
  var dist = 0.0;
  for (var i = 0; i < Math.min(i1.length, i2.length); i++) {
    var first = i1[i], second = i2[i];
    if (first._id.valueOf() == second._id.valueOf()) {
      dist += Math.abs(first.amount - second.amount);
    } else {
      dist += (first.amount + second.amount) * config.diffPenalty;
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

  return lengthDiff * config.lengthPenalty + numerator / samples.length + penalty;
};

var choosePermute = function(amount, recipes) {
  var permutations = [];

  function inner(arr, index) {
    if (index >= amount) {
      permutations.push(arr);
      return;
    }

    for (var r = 0; r < recipes.length; r++) {
      if (index < amount) {
        var arr2 = arr.concat([recipes[r]]);
        inner(arr2, index + 1);
      }
    }

    return;
  }

  inner([], 0);

  return permutations;
};

var generate = function(amount, similarity) {
  similarity = parseFloat(similarity);
  config.diffPenalty = similarity;
  config.lengthPenalty = similarity;

  var recipeResult = recipeProvider.randomly(sampleSize);
  var done = recipeResult.then(function(recipes) {
    var current = _.times(sampleCount * 1000, function() {
      return _.times(amount, function() {
        return _.sample(recipes, 1)[0];
      });
    });

    return _.min(current, sampleError);
  });
  return done;
};

module.exports = {
  generate: generate
};
