angular.module('recipeViewerApp').controller('IngredientListController', function($scope, $modal, $http) {
    $scope.items = [];
    $scope.itemLimit = 12;
    $scope.users = $scope.items;
    $scope.ingredient_list = [];
    $scope.ingredients = [];
    $scope.text = 'item';
    $scope.selected = {
      ingredients: $scope.ingredients[0]
    };

    $scope.addQuery = function(e) {
        if ($scope.items) {
            if ($scope.ingredients.indexOf($scope.items) == -1 && $scope.ingredient_list.indexOf($scope.items) !== -1) {
                $scope.ingredients.push($scope.items);
                $scope.items = '';
            }
            else {
                $scope.invalidModal();
                //alert ("The ingredient you entered is not on the database or is already submitted.");
            }
        }
    };

    $scope.enter = function (e) {
        if(e.which == 13){
            $scope.addQuery();
        }
    };

    $scope.remove = function(item) {
        var index = $scope.ingredients.indexOf(item);
        $scope.ingredients.splice(index, 1);
    };

    $scope.reset = function() {
        $scope.ingredients = [];
    };


    $http.get('/api/ingredient-names').
      success(function(data) {
        $scope.ingredient_list = data.ingredients;
        });

    $scope.resetModal = function (size) {
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

    $scope.removeModal = function (size) {
        var modalInstance = $modal.open({
            templateUrl: 'delete.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            resolve: {
                ingredients: function () {
                    return $scope.ingredients;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.remove("ingredient");
        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.invalidModal = function (size) {
        var modalInstance = $modal.open({
            templateUrl: 'invalid.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            resolve: {
                ingredients: function () {
                    return $scope.ingredients;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.remove("ingredients");
        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });
    };
});

angular.module('recipeViewerApp').controller('ModalInstanceCtrl', function ($scope, $modalInstance, ingredients) {
    $scope.ingredients = ingredients;
    $scope.ok = function () {
        $modalInstance.close();
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});