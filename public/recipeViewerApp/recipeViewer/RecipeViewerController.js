angular.module('recipeViewerApp').controller('RecipeViewerController', function($scope, $http, $filter) {
  $scope.recipes = [];
  $scope.user = "";
  $scope.meals = [];

  $scope.format = 'dd-MMMM-yyyy';
  $scope.dateStart = new Date();
  $scope.dateEnd = new Date();

  $scope.toggleMin = function() {
    $scope.minDate = $scope.minDate ? null : new Date();
  };

  $scope.toggleMin();

  $scope.openStart = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.startOpened = true;
  };

  $scope.similarity = 25;

  $scope.openEnd = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.endOpened = true;
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };


  $scope.fetchRecipes = function() {
    var start = $filter('date')($scope.dateStart, 'yyyy-M-dd');
    var end = $filter('date')($scope.dateEnd, 'yyyy-M-dd');

    $http.get('/api/generate-recipes/' + start + '/' + end + '/' + $scope.similarity + '/' + JSON.stringify($scope.selectedIngredients)).
        success(function(data) {
          $scope.recipes = data.recipes;
          $scope.dates = data.dates;
        });
  };

 $http.get('/api/user-stuff').
    success(function(data) {
      $scope.user = data.user;
    });
    
  $http.get('/api/savedmeals'). 
    success(function(data) {
      $scope.meals = data.mealplan;
    });

  $scope.deleteMeal = function(meal,mealid) {
    // alert(meal);
    // $scope.meals.splice($scope.meals.indexOf(idx), 1);

    $http.post('/delete-meals', {mealplan: mealid}).
      success(function(data) {
        $scope.meals.splice($scope.meals.indexOf(meal), 1);
      });
  };

});