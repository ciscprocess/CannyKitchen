// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var RecipeSchema = new Schema({
  name: String,
  ingredients: Array,
  url: String,
  image: String,
  duration: String,
  yield: String,
  description: String
});

RecipeSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

var Recipe = mongoose.model('Recipe', RecipeSchema);

Recipe.prototype.fromWebCall = function() {
  console.log('It worked, though!');
};

