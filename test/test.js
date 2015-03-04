// setting global libraries
GLOBAL._ = require('underscore');

var glob = require('glob'),
    config = require('../config/config');

var models = glob.sync(config.root + '/app/models/*.js');

models.forEach(function (model) {
  require(model);
});

var assert = require("assert"),
    IngredientParser = require('../app/procedures/generation/ingredient-parser');

describe('IngredientParser', function(){
  describe('#parseDescriptor()', function(){
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
        var promise = IngredientParser.parseDescriptor(descriptor.input);
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
