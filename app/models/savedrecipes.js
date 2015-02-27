var mongoose = require("mongoose");
var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId,
	Recipe = mongoose.model('Recipe');

var savedRecipeSchema = new Schema({
	username: String,
	created: Date,
	recipes: [Recipe.schema]
});

module.exports = mongoose.model('SavedRecipes', savedRecipeSchema, 'savedrecipes');