var mongoose = require('mongoose'),
    IngredientType = mongoose.model('IngredientType'),
    inflection = require('inflection'),
    WordPOS = require('wordpos'),
    wordpos = new WordPOS(),
    q = require('Q');


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
  'gram',
  'g',
  'milliliter',
  'millilitre',
  'mL',
  'liter',
  'litre',
  'L',
  'pound',
  'lb',
  'container',
  'box',
  'fl oz',
  'floz',
  'cup',
  'quart',
  'pint',
  'gallon'];

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
  var cardinalUnion = '.*(' + cardinals.join('|') + ')',
  // though it generates ungrammatical plurals (such as 'handfules'), I'm not worried about that kind of FP
      plurals = _.chain(units).map(function(a) { return [a + 'es', a + 's', a]; }).flatten().value(),
      unitsUnion = '(' + plurals.join('|') + ')',
      numbers = '([0-9]*|' + cardinalUnion + ')',
      fractions = '(\\.[0-9])*([0-9]*/[0-9]*)*(\xBC|\xBD|\xBE)*',
      measure = numbers + ' *' + fractions + ' *' + unitsUnion + '*',
      space = ' *(of|for)* *',
      description = '(.*)',
      finalRegex = measure + space + description,
      match;

  try {
    match = new RegExp(finalRegex);
  } catch(e) {
    console.log(e);
  }

  return match;
};

var rejectDescriptor = function(descriptor) {
  return descriptor.slice(0, descriptor.length/2) === descriptor.slice(descriptor.length/2 + 1, descriptor.length);
};

var isNoun = function(word) {
  var deferred = q.defer();
  wordpos.isNoun(word, function(bool) {
    bool ? deferred.resolve(true, word) : deferred.resolve(false, word);
  });
  return deferred.promise;
};

var stripNonNouns = function(sentence) {
  var deferred = q.defer(),
      promise = q(null),
      words = sentence.split(' '),
      accepted = [];

  _(words).each(function(word) {
    promise = promise.then(function() {
      return isNoun(word);
    }).then(function(result) {
      result ? accepted.push(word) : _.noop();
    });
  });

  promise.then(function() {
    deferred.resolve(accepted.join(' '));
  });

  return deferred.promise;
};

var parse = function(descriptor) {
  var results = matchRegex().exec(descriptor.toLowerCase());
  var name = results[8];

  var noadj = stripNonNouns(name).then(function(sentence) {
    return sentence.replace(',', '');
  });

  noadj.then(function(final) {
    var ingredientType = new IngredientType({
      normalizedName: final
    });

    if (!rejectDescriptor(descriptor)) {
      ingredientType.save(function(err) {
        console.error(err);
      });
    } else {
      console.warn('Descriptor rejected: ' + descriptor);
    }
  });




  return null;
};

module.exports = {
  parseDescriptor: parse
};