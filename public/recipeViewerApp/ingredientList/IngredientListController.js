angular.module('recipeViewerApp').controller('IngredientListController', function($scope, $http) {
    var ingredientDiv = $('#ingredients');
    var i = $('#ingredients i').size() + 1;
    $scope.addQuery = function() {
        $('<p><label for="ingredients"><input type="text" id="ingredient" size="20" name="ingredient_' + i +'" value="" placeholder="Search" /></label> <a href="#" id="removeIngredient">Remove</a></p>').appendTo(ingredientDiv); i++; return false;
    };
});