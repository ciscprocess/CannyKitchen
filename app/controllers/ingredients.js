var express = require('express'),
    router = express.Router(),
    ingredientProvider = require('../providers/ingredient-provider.js'),
    mongoose = require('mongoose'),
    Recipe = mongoose.model('Recipe'),
    IngredientType = mongoose.model('IngredientType');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/api/ingredients/keyword/:keyword', function (req, res) {
  var keyword = req.params.keyword;

  ingredientProvider.byName(keyword).then(function(ingredients) {
    res.json(ingredients);
  });
});

router.get('/api/ingredients', function (req, res) {
    var food = req.body.item;
    res.send({
        itm: food
    });
});

router.get('/api/ingredient-names', function (req, res) {
  IngredientType.distinct("normalizedName", function (err, ingredients) {
    if (ingredients) {
      res.send({
        ingredients: ingredients
      });
    }
  });
});