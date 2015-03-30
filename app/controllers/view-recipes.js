var express = require('express'),
    router = express.Router(),
    generator = require('../procedures/generation/recipe-generator'),
    mongoose = require('mongoose'),
    SavedRecipes = mongoose.model('SavedRecipes'),
    Recipe = mongoose.model('Recipe');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/view-recipes/:start/:end', function (req, res) {
  var start = parseInt(req.params.start),
      end = parseInt(req.params.end);

  generator.generate(end - start, 0).then(function(recipes) {
    res.render('view-recipes', {
      recipes: recipes,
      start: start,
      name: req.session.username
    });
  });
});
