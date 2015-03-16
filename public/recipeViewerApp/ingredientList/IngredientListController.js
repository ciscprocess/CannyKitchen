angular.module('recipeViewerApp').controller('IngredientListController', function($scope) {
    $scope.ingredients = [];
    $scope.itemLimit = 12;
    $scope.text = 'item';

    $scope.suggestions = [
        'Apple',
        'Banana',
        'Cabbage',
        'Dandelion',
        'Egg',
        'Fennel',
        'Grape',
        'Icing',
        'Jam',
        'Ketchup'];

    $scope.addQuery = function(e) {
        if ($scope.items) {
            $scope.ingredients.push($scope.items);
            $scope.items = '';
        }
    };

    $scope.enter = function (e) {
        if(e.which == 13){
            $scope.addQuery();
        }
    };

    $scope.remove = function(item) {
        var answer = confirm("Are you sure you want to delete this ingredient?");
        if (answer) {
            var index = $scope.ingredients.indexOf(item);
            $scope.ingredients.splice(index, 1);
        }
    };
    $scope.reset = function() {
        var answer = confirm ("Are you sure you want to delete all ingredients?");
        if (answer) {
            $scope.ingredients = [];
        };
    };
});