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
                    <li><a href="/contact">Contact</a></li>
                    <li><a href="/links">Links</a></li>
                    {% if name %}
                        <li><a href="/savedmeals">My Meal Plans</a></li>
                        <li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown">{{ name }} <span class="caret"></span></a>
                            <ul class="dropdown-menu" role="menu">
                                <li><a href="/logout">Logout</a></li>
                            </ul>
                        </li>
                    {% else %}
                        <li><a href="/login">Login</a></li>
                    {% endif %}
                    <!-- <li><a href="signup.html">Signup</a></li> -->
                </ul>
            </div>
        </div>
    </nav>

    {% block pageContent %}
        <div class="main-container row" ng-controller="MainViewController" ng-app="recipeViewerApp">
            <div class="col-md-3" style="min-width: 220px; max-width: 400px;" ng-include="'/recipeViewerApp/ingredientList/IngredientListTemplate.html'"></div>
            <div class="col-md-7" ng-include="'/recipeViewerApp/recipeViewer/RecipeViewerTemplate.html'"></div>

        </div>
    {% endblock %}
{% endblock %}
