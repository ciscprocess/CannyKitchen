// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var RecipeSchema = new Schema({
  name: String,
  ingredients: Array,
  url: String,
  image: String,
  duration: Number,
  yield: Number,
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

