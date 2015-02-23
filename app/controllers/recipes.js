var express = require('express'),
    router = express.Router(),
    generator = require('../procedures/generation/recipe-generator');

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
