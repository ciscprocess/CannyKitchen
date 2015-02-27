angular.module('recipeViewerApp').controller('IngredientListController', function($scope, $http) {
    $scope.itm = [];
    var ingredients = 1;
    $scope.addQuery = function(e) {
        $http.get('/api/items').
            success(function(data) {
                $scope.itm = data;
            });
    };
    $scope.removeQuery = function(e) {
        alert("Remove this ingredient?");
    }
    $scope.reset = function(e) {
        alert("Are you sure you want to delete all ingredients?");
    }
});