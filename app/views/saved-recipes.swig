{% extends 'index.swig' %}

{% block pageContent %}
    <div class="home-pane container" ng-app="recipeViewerApp" ng-controller="RecipeViewerController">
        <h1>
            Your Saved Recipes
        </h1>
        
        <div ng-repeat="meal in meals | orderBy:'-created'">
        <b>Meal Plan {% raw %} {{ $index+1 }} {% endraw %}</b> (<a ng-click="deleteMeal($index, meal._id)" href="">Delete Meal Plan</a>)
        <ul>
            <li ng-repeat="m in meal.recipes">Day {% raw %} {{ $index+1 }} {% endraw %}: <a href="{% raw %} {{ m.url }} {% endraw %}">{% raw %} {{ m.name }} {% endraw %}</a></li>
        </ul>
        </div>
<!--             <p>You don't have any meal plans saved.</p> -->

    </div>
{% endblock %}