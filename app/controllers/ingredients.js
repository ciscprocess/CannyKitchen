var express = require('express'),
    router = express.Router(),
    ingredientProvider = require('../providers/ingredient-provider.js'),
    mongoose = require('mongoose'),
    Recipe = mongoose.model('Recipe');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/api/ingredients/keyword/:keyword', function (req, res) {
  var keyword = req.params.keyword;
  Recipe.fromWebCall();
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