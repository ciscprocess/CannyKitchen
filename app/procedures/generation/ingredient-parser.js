
var units = ['pound',
  'pinch',
  'handful',
  'clove',
  'kilo',
  'kilogram',
  'tablespoon',
  'tbsp',
  'teaspoon',
  'tsp',
  'gram'];

var cardinals = ['one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten'];

var matchRegex = function() {
  var cardinalUnion =
      '(' + _.reduce(cardinals, function(a,b) { return a + '|' + b; }, '') + ')';

  return cardinalUnion;
};

var parse = function(descriptor) {
  matchRegex();
};

module.exports = {
  parseDescriptor: parse
};