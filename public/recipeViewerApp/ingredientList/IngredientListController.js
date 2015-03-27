angular.module('recipeViewerApp').controller('IngredientListController', function($scope, $http) {
    $scope.items = [];
    $scope.itemLimit = 12;
    $scope.users = $scope.items;
    $scope.ingredient_list = [];
    $scope.ingredients = [];
    $scope.text = 'item';

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
        $scope.ingredients = [];

    };

    $scope.open = function (size) {
        var modalInstance = $modal.open({
            templateUrl: 'reset.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            resolve: {
                ingredients: function () {
                    return $scope.ingredients;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
           $scope.reset();
        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });
    };
});

angular.module('recipeViewerApp').controller('ModalInstanceCtrl', function ($scope, $modalInstance, ingredients) {
    $scope.ingredients = ingredients;
    $scope.selected = {
        ingredients: $scope.ingredients[0]
    };
    $scope.ok = function () {
        $modalInstance.close();
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $http.get('/api/ingredient-names').
    	success(function(data) {
    		$scope.ingredient_list = data.ingredients;
    	});
});