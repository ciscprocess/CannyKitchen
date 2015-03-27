var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    IngredientType = mongoose.model('IngredientType');

var IngredientSchema = new Schema({
  type: {
    type: Schema.ObjectId,
    ref: 'IngredientType'
  },
  amount: Number,
  tags: Array
});

IngredientSchema.virtual('date')
    .get(function(){
      return this._id.getTimestamp();
    });

mongoose.model('Ingredient', IngredientSchema);