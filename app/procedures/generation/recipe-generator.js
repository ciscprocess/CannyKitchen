var recipeProvider = require('../../providers/recipe-provider'),
    parser = require('./ingredient-parser'),
    q = require('q'),
    sampleSize = 50;

var ingredDist = function(i1, i2) {
  var dist = 0;
  _.each(_.zip(i1, i2), function(pair) {
    var first = pair[0], second = pair[1];
    if (first._id.valueOf() == second._id.valueOf()) {
      dist += Math.abs(first.amount - second.amount);
    } else {
      dist += first.amount + second.amount;
    }
  });

  return dist;
};

var distance = function(r1, r2, sampleCount) {
  sampleCount = (sampleCount || 20);
  var lengthDiff = Math.abs(r1.ingredients.length - r2.ingredients.length);
  var editSize = Math.min(r1.ingredients.length, r2.ingredients.length);
  var poolSize = Math.max(r1.ingredients.length, r2.ingredients.length);
  var larger = r1.ingredients.length > r2.ingredients.length ? r1 : r2;
  var smaller = r1.ingredients.length <= r2.ingredients.length ? r1 : r2;
  var samples = [];

  for (var i = 0; i < sampleCount; i++) {
    samples.push(_.sample(larger.ingredients, editSize));
  }

  var min = Number.MAX_VALUE;
  _.each(samples, function(sample) {
    var d = ingredDist(sample, smaller.ingredients);
    if (d < min) {
      min = d;
    }
  });

  return lengthDiff + min;
};

var generate = function(amount) {
  var recipeResult = recipeProvider.randomly(sampleSize);
  var done = recipeResult.then(function(recipes) {
      
    return recipes;
  });
  return done;
};

module.exports = {
  generate: generate
};
