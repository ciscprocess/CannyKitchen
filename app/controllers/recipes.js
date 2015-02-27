var express = require('express'),
    router = express.Router(),
    generator = require('../procedures/generation/recipe-generator'),
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

    if (_.any(recipes, function(recipe) { return !recipe.ingredients || recipe.ingredients.length < 0; })) {
      console.log('Error: Recipes with no Ingredients returned!');
    }

    var result = {
      dates: dates,
      recipes: recipes
    };

    res.json(result);
  });
});
