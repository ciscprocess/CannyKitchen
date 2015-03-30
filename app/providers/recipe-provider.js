var mongoose = require('mongoose'),
    request = require('request'),
    q = require('q'),
    Recipe = mongoose.model('Recipe'),
    IngredientType = mongoose.model('IngredientType');

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

  var queryPromises = [];
  var theRecipes = [];
  deferred.promise.then(function(recipes) {
    theRecipes = recipes;
    _.each(recipes, function(recipe, key) {
      var types = _.pluck(recipe.ingredients, 'type');
      var amounts = _.pluck(recipe.ingredients, 'amount');
      var deferred2 = q.defer();

      queryPromises.push(deferred2.promise);
      IngredientType.find({_id: { $in: types }}, function(err, list) {
        recipe.prettyIngredients = _.zip(_.pluck(list, 'normalizedName'), amounts);
        deferred2.resolve();
      });
    });
  });

  return deferred.promise.then(function() {
    return q.all(queryPromises);
  }).then(function() {
    return theRecipes;
  });
};

module.exports = {
  byName: requestByName,
  randomly: requestRandom
};