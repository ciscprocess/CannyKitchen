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

mongoose.model('Recipe', RecipeSchema);

