var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var IngredientTypeSchema = new Schema({
  normalizedName: {
    type: String,
    index: { unique: true }
  },
  aliases: Array
});

IngredientTypeSchema.virtual('date')
    .get(function(){
      return this._id.getTimestamp();
    });

var IngredientType = mongoose.model('IngredientType', IngredientTypeSchema);

// ensure that no duplicate entries can happen
