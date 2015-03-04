angular.module('recipeViewerApp').controller('IngredientListController', function($scope, $http) {
    $scope.items = ['a', 'b'];
    $scope.itemLimit = 12;
    $scope.text = 'item';
    $scope.users = $scope.items;

    $scope.addQuery = function(e) {
        if ($scope.Ingredients) {
            $scope.items.push($scope.Ingredients);
            $scope.Ingredients = '';
        }
    };

    $scope.enter = function (e) {
        if(e.which == 13){
            $scope.addQuery();
        }
    };

    $scope.remove = function(item) {
        alert("Are you sure you want to delete this ingredient?");{
            var index = $scope.items.indexOf(item);
            $scope.items.splice(index, 1);
        }
    };
    $scope.reset = function() {
        alert("Are you sure you want to delete all ingredients?");
        $scope.items.length = 0;
    };
});