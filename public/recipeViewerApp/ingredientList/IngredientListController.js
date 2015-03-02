angular.module('recipeViewerApp').controller('IngredientListController', function($scope, $http) {
    $scope.items = ['a', 'b'];
    $scope.text = 'item';
    $scope.addQuery = function(e) {
        if ($scope.Ingredients) {
            $scope.items.push($scope.Ingredients);
            $scope.Ingredients = '';
        }
    };
    $scope.removeQuery = function(e) {
        alert("Are you sure you want to delete this ingredient?");
    };
    $scope.reset = function(e) {
        alert("Are you sure you want to delete all ingredients?");
    };
});