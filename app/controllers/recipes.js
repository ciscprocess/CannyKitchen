var express = require('express'),
    router = express.Router(),
    generator = require('../procedures/generation/recipe-generator'),
    mongoose = require('mongoose'), 
    SavedRecipes = mongoose.model('SavedRecipes'),
    Recipe = mongoose.model('Recipe'),
    IngredientType = mongoose.model('IngredientType'),
    moment = require('moment'),
    q = require('q');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/api/generate-recipes/:start/:end/:similarity/:ingredients', function (req, res) {
  var start = moment(req.params.start),
      end = moment(req.params.end),
      similarity = req.params.similarity,
      selectedIngredients = req.params.ingredients,
      duration = moment.duration(Math.abs(end.diff(start)));

  generator.generate(duration.days(), similarity, JSON.parse(selectedIngredients)).then(function(recipes) {
    var dates =  [];
    _.each(_.range(0, duration.days()), function() {
      dates.push(start.format('YYYY-MM-DD'));
      start.add(1, 'days');
    });

    if (_.any(recipes, function(recipe) { return !recipe.ingredients || recipe.ingredients.length <= 0; })) {
      console.log('Error: Recipes with no Ingredients returned!');
    }

    var result = {
      dates: dates,
      recipes: recipes
    };

    res.json(result);
  });
});

router.get('/api/user-stuff', function (req, res) {
  res.send({
    user: req.session.username
  });
});

router.get('/api/savedmeals', function (req, res) {
  SavedRecipes.find({ username: req.session.username }, function (err, recipes) {
    if (recipes) {
      res.send({
        title: "My Meal Plans", 
        name: req.session.username,
        mealplan: recipes
      });
    }
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

router.post('/delete-meals', function (req, res) {
  var mealplan = req.body.mealplan;
  SavedRecipes.find({ _id: mealplan }).remove().exec();
  res.redirect('/savedmeals');
});
