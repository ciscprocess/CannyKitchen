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
  'gallon',
  'bag',
  'oz',
  'dash',
  'tb',
  '/.*oz',
  'ounce',
  'bunch',
  'package',
  'strip'];

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

var exceptions = ['baking', 'black', 'white', 'yellow', 'green', 'red', 'salt'];

var matchRegex = function() {
  var cardinalUnion = cardinals.join('|'),
  // though it generates ungrammatical plurals (such as 'handfules'), I'm not worried about that kind of FP
      plurals = _.chain(units).map(function(a) { return [a + 'es', a + 's', a]; }).flatten().value(),
      unitsUnion = '(' + plurals.join('|') + ')',
      numbers = '([0-9]|' + cardinalUnion + ')*',
      fractions = '([0-9]*/*[0-9]*)*(\xBC|\xBD|\xBE)*',
      measure = numbers + ' *' + fractions + ' *' + unitsUnion + '*',
      space = ' *(of|for)* *',
      description = '(.*)',
      finalRegex = measure + space + description,
      match;

  try {
    //console.log(finalRegex);
    match = new RegExp(finalRegex);
  } catch(e) {
    console.log(e);
  }

  return match;
};

var rejectDescriptor = function(descriptor) {
  return descriptor.slice(0, descriptor.length/2) === descriptor.slice(descriptor.length/2 + 1, descriptor.length);
};

var rejectExtraction = function(final) {
  var plurals = _.chain(units).map(function(a) { return [a + 'es', a + 's', a]; }).flatten().value(),
      unitsUnion = '.* *(' + plurals.join('|') + ') *.*';
  var match = new RegExp(unitsUnion);

  if (final.indexOf('/') !== -1 || match.exec(final)) {
    return true;
  } else {
    return false;
  }
};

var isOnlyNoun = function(word) {
  var deferred = q.defer();
  wordpos.getPOS(word, function(pos) {
    var bool = (pos.nouns.length && !pos.adjectives.length && !pos.adverbs.length)
        || exceptions.indexOf(word) !== -1
        || pos.rest.length > 0;
    //console.log('word: ' + word, ', ' + bool);
    deferred.resolve(bool, word);
  });
  return deferred.promise;
};

var stripNonNouns = function(sentence) {
  var deferred = q.defer(),
      promise = q(null),
      words = _(sentence.split(' ')).map(function(s) { return s.trim(); }),
      accepted = [];

  _(words).each(function(word) {
    var singular = inflection.singularize(word);
    //console.log('sing: ' + singular);
    promise = promise.then(function() {
      return isOnlyNoun(singular);
    }).then(function(result) {
      result ? accepted.push(singular) : _.noop();
    });
  });

  promise.then(function() {
    //console.log('accepted: ' + accepted.join(','));
    deferred.resolve(accepted.join(' '));
  });

  return deferred.promise;
};

var parse = function(descriptor) {
  var results = matchRegex().exec(descriptor.toLowerCase().replace(':', '').replace('.', ''));
  //console.log(JSON.stringify(results));
  var name = _(results[6].split(',')).first();
  var noadj = stripNonNouns(name).then(function(sentence) {
    return sentence.replace(',', '');
  });

  var promise = noadj.then(function(final) {
    var ingredientType = new IngredientType({
      normalizedName: final
    });


    return (rejectDescriptor(descriptor) || rejectExtraction(final)) ? null : ingredientType;
  });




  return promise;
};

module.exports = {
  parseDescriptor: parse
};