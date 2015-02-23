var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var IngredientTypeSchema = new Schema({
  normalizedName: String,
  aliases: Array
});

IngredientTypeSchema.virtual('date')
    .get(function(){
      return this._id.getTimestamp();
    });

var Recipe = mongoose.model('IngredientType', IngredientTypeSchema);