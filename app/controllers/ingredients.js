var express = require('express'),
    router = express.Router(),
    ingredientProvider = require('../providers/ingredient-provider.js');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/api/ingredients/keyword/:keyword', function (req, res) {
  var keyword = req.params.keyword;

  ingredientProvider.byName(keyword);

  res.json({
    name: 'ingredient-1',
    term: keyword
  });
});