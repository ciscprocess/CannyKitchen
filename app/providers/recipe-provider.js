var mongoose = require('mongoose'),
    request = require('request'),
    q = require('q'),
    Recipe = mongoose.model('Recipe'),
    _ = require('underscore');

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
  var deferred = q.defer(),
      countResult = Recipe.count(),
      skip = 0;//_.random(0, count - howMany - 1);

  countResult.exec(function(iHateAsync, count) {
    skip = _.random(0, count - howMany - 1);
    Recipe.find({
      $query: {
      }
    }).skip(skip).limit(howMany).exec(function(error, recipes) {
      if (error || !recipes) {
        deferred.reject('Error in requestRandom');
      } else {
        //var index = _.random(0, recipes.length - 1);
        recipes.forEach(function(recipe) {
          recipe.image = (recipe.image || '')
              .replace('http://static.tastykitchen.com/recipes/files/',
              'http://tastykitchen.com/recipes/wp-content/uploads/sites/2/');
        });
        deferred.resolve(recipes);
      }
    });
  });

  return deferred.promise;
};

module.exports = {
  byName: requestByName,
  randomly: requestRandom
};