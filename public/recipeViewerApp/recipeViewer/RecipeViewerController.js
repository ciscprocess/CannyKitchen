angular.module('recipeViewerApp').controller('RecipeViewerController', function($scope, $http) {
  $scope.recipes = [];

  $scope.fetchRecipes = function() {
    $http.get('/api/generate-recipes/0/15').
        success(function(data) {
          $scope.recipes = data;
        });
  };
});