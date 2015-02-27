var express = require('express'),
    router = express.Router(),
    generator = require('../procedures/generation/recipe-generator'),
    mongoose = require('mongoose'), 
    SavedRecipes = mongoose.model('SavedRecipes'),
    Recipe = mongoose.model('Recipe');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/api/generate-recipes/:start/:end', function (req, res) {
  var start = parseInt(req.params.start),
      end = parseInt(req.params.end);

  generator.generate(end - start, 0).then(function(recipes) {

    res.json(recipes);
  });
});

router.get('/api/user-stuff', function (req, res) {
  res.send({
    user: req.session.username
  });
});

router.get('/savedmeals', function (req, res) {
  SavedRecipes.find({ username: req.session.username }, function (err, recipes) {
    if (recipes) {
      res.render('saved-recipes', {
        title: "My Meal Plans", 
        name: req.session.username,
        mealplan: recipes
      });
    }
  });
});

router.post('/savedmeals', function (req, res) {
  var newMealplan = new SavedRecipes({
    username: req.session.username,
    created: Date.now()
  });
  var urlarray = req.body.recipeurl; 
  var namearray = req.body.recipename;
  var ingrarray = req.body.recipeingr;
  for (var i = 0; i < urlarray.length; i++) {
    newMealplan.recipes.push({ name: namearray[i], url: urlarray[i], ingredients: ingrarray[i] });
  }
  newMealplan.save(function (err) {
    if (err) res.send('Error');
    res.redirect('/savedmeals');
  });
});
