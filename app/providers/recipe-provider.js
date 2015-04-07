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
  var typeDeferred = q.defer();
  queryPromises.push(typeDeferred.promise);
  deferred.promise.then(function(recipes) {
    theRecipes = recipes;
    IngredientType.find().sort({ _id: 1 }).exec(function(err, ingredientTypes) {
      _.each(recipes, function(recipe, key) {
        var types = _.pluck(recipe.ingredients, 'type');
        var amounts = _.pluck(recipe.ingredients, 'amount');
        var deferred2 = q.defer();

        queryPromises.push(deferred2.promise);
        IngredientType.find({_id: { $in: types }}, function(err, list) {
          recipe.prettyIngredients = _.zip(_.pluck(list, 'normalizedName'), amounts);
          deferred2.resolve();
        });

        var vector = [];
        _.each(ingredientTypes, function(ingredientType, index) {
          var incident = _.find(recipe.ingredients, function(val) {
            return val.type.equals(ingredientType._id);
          });
          if (incident) {
            vector[index] = incident.amount;
          } else {
            vector[index] = 0;
          }
        });

        recipe.vector = vector;
      });

      typeDeferred.resolve();
    });

  });

  return typeDeferred.promise.then(function() {
    return q.all(queryPromises);
  }).then(function() {
    return theRecipes;
  });
};

var getIngredientsVectors = function(recipes) {
  Recipe.find({
    'ingredients.0': { $exists: true }
  }).sort({
    selectionToken: 1
  }).exec(function(error, recipes) {

  });
};

module.exports = {
  byName: requestByName,
  randomly: requestRandom,
  ingredientsVector: getIngredientsVectors
};