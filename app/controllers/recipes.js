var express = require('express'),
    router = express.Router(),
    generator = require('../procedures/generation/recipe-generator'),
    mongoose = require('mongoose'), 
    SavedRecipes = mongoose.model('SavedRecipes'),
    Recipe = mongoose.model('Recipe');
    moment = require('moment');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/api/generate-recipes/:start/:end', function (req, res) {
  var start = moment(req.params.start),
      end = moment(req.params.end),
      days = moment.duration(Math.abs(end.diff(start)));

  generator.generate(days.days(), 0).then(function(recipes) {
    var dates =  [];
    _.each(_.range(0, days.days()), function() {
      dates.push(start.format('YYYY-MM-DD'));
      start.add(1, 'days');
    });

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
