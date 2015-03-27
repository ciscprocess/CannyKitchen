<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
<script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.9.1/jquery-ui.min.js"></script>

{% extends 'layout.swig' %}
{% block content %}
    <!-- Navigation -->
    <nav class="navbar navbar-default navbar-custom navbar-fixed-top">
        <div class="container">
            <div class="navbar-header page-scroll">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#navbar-collapse1">
                    <!-- Create "hamburger" icon to access menu (mobile) -->
                    <span class="sr-only">Toggle Navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="/">CannyKitchen</a>
            </div>
            <div class="collapse navbar-collapse" id="navbar-collapse1">
                <ul class="nav navbar-nav navbar-right">
                    <li><a href="/">Home</a></li>
                    <li><a href="/about">About</a></li>
                    <li><a href="#">Contact</a></li>
                    {% if name %}
                        <li><a href="/savedmeals">My Meal Plans</a>
                        <li><a href="/logout">Logout</a></li>
                    {% else %}
                        <li><a href="/login">Login</a></li>
                    {% endif %}
                    <!-- <li><a href="signup.html">Signup</a></li> -->
                </ul>
            </div>
        </div>
    </nav>

    {% block pageContent %}
        <div class="container main-container" ng-app="recipeViewerApp">
            <aside class="sidebar">
                <div class="intro">
                    <p>Search the ingredients you have and plan to use at the search bar. It will then add the ingredients to the box below.</p>
                </div>
                <div ng-app="" ng-controller="IngredientListController">
                    <p>Search for your ingredients</p>
                    <input ng-keypress="enter($event)" placeholder="Search" list="list" name="ingredients" ng-model="Ingredients"/>

                    <datalist id="list" ng-if="ingredient_list">
                        <option ng-repeat="i in ingredient_list" value="{% raw %} {{ i }} {% endraw %}">
                    </datalist>

                    <button ng-click="addQuery()">Submit</button>
                    <p>Ingredient Lists</p>

                    <select size="10" multiple="multiple" style="width: 300px">
                        <option ng-repeat="item in items">{% raw %} {{ item }} {% endraw %}</option>
                    </select>

                    <!--<div class="array">
                        <p>Ingredients:</p>
                            <select name="input" multiple="multiple" size=10 width=200 STYLE="width: 200px" ng-controller="IngredientListController">
                                <option value="input">empty</option>
                            </select>-->
                    <button ng-click="remove()">Remove</button>
                    <button ng-click="reset()">Reset</button>
                </div>
                <div class="description">
                    <p>After putting all your ingredients, click "Generate Meal Plan" button at right to receive your available recipes. It's simple!</p>
                </div>
            </aside>
            <div ng-include="'/recipeViewerApp/recipeViewer/RecipeViewerTemplate.html'"></div>
        </div>
    {% endblock %}
    {% endblock %}
