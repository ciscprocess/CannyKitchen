angular.module('recipeViewerApp').controller('RecipeViewerController', function($scope, $http) {
  $scope.recipes = [];
  $scope.user = "";

  $scope.fetchRecipes = function() {
    $http.get('/api/generate-recipes/0/15').
        success(function(data) {
          $scope.recipes = data;
        });
  };

 $http.get('/api/user-stuff').
    success(function(data) {
      $scope.user = data.user;
    });
    
});