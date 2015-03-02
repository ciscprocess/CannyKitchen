var mongoose = require('mongoose'),
    request = require('request'),
    q = require('q'),
    Recipe = mongoose.model('Recipe');

var requestByName = function(name) {
  var deferred = q.defer();

  if (!name) {
    deferred.reject('\'name\' parameter must be a string!');
  }

  Recipe.findOne({
    name: name
  }, function(error, recipes) {
    if (error) {
      deferred.reject('Error in querying mongo database.');
    } else {
      deferred.resolve(recipes);
    }
  });

  return deferred.promise;
};

var requestRandom = function(howMany) {
  var deferred = q.defer();

  Recipe.find({
    selectionToken: { $gt: Math.random() },
    'ingredients.0': { $exists: true }
  }).sort({ selectionToken: 1 })
    .limit(howMany)
    .lean()
    .exec(function(error, recipes) {
    if (error || !recipes) {
      deferred.reject('Error in requestRandom');
    } else {
      recipes.forEach(function(recipe) {
        // ugly, temporary, hack until I can fix the data
        recipe.image = (recipe.image || '')
            .replace('http://static.tastykitchen.com/recipes/files/',
            'http://tastykitchen.com/recipes/wp-content/uploads/sites/2/');
      });
      deferred.resolve(recipes);
    }
  });

  return deferred.promise;
};

module.exports = {
  byName: requestByName,
  randomly: requestRandom
};