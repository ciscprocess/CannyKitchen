var express = require('express'),
    router = express.Router();

module.exports = function (app) {
  app.use('/', router);
};

router.get('/api/ingredients', function (req, res) {
  res.json({
    name: 'ingredient-1'
  });
});