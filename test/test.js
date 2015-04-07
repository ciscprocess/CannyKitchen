// setting global libraries
GLOBAL._ = require('underscore');

var glob = require('glob'),
    config = require('../config/config');

var models = glob.sync(config.root + '/app/models/*.js');

models.forEach(function (model) {
  require(model);
});

var assert = require("assert"),
    IngredientParser = require('../app/procedures/generation/ingredient-parser'),
    RecipeGenerator = require('../app/procedures/generation/recipe-generator');

describe('RecipeGenerator', function() {
  describe('#distance()', function() {
    it('should correctly find the distance between two recipes', function(done) {
      var r1 = {
        vector: [0, 2, 4, 0]
          }, r2 = {
        vector: [1, 2, 0, 2]
      };

      var dist = RecipeGenerator._test.distance(r1, r2);
      if (dist === 7)
        done();
      else
        done(new Error());
    });
  });
});

describe('IngredientParser', function(){
  describe('#parseType()', function(){
    var descriptors = [
      { input: '1 raw egg, beaten', output: 'egg' },
      { input: 'three apples, granny smith', output: 'apple' },
      { input: 'three handfuls sesame seeds', output: 'sesame seed' },
      { input: 'one bag of frozen broccoli', output: 'broccoli' },
      { input: 'two tablespoons baking powder', output: 'baking powder' },
      { input: '6 cups Rice Krispies', output: 'rice krispy' },
      { input: '1/2 teaspoon Salt', output: 'salt' },
      { input: '4 cups whole milk', output: 'milk' },
      { input: '2 teaspoons Black Pepper, More To Taste', output: 'black pepper' },
      { input: 'SAUSAGE GRAVY', output: 'sausage gravy' }
    ];

    _(descriptors).each(function(descriptor) {

      it('should correctly strip the sentence: ' + descriptor.input, function(done){
        var promise = IngredientParser.parseType(descriptor.input);
        promise.then(function(type) {
          if (type.normalizedName !== descriptor.output) {
            done(new Error('Got: ' + type.normalizedName + ', expected: ' + descriptor.output));
          } else {
            done();
          }
        });
      });

    });
  });
});
