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
                    <li><a href="/">Links</a></li>
                    {% if name %}
                        <li><a href="logout">Logout</a></li>
                    {% else %}
                        <li><a href="login">Login</a></li>
                    {% endif %}
                    <!-- <li><a href="signup.html">Signup</a></li> -->
                </ul>
            </div>
        </div>
    </nav>

    {% block pageContent %}
        <div class="container main-container" ng-app="recipeViewerApp">
            <aside class="well sidebar-nav sidebar-custom">
                <div class="intro">
                    <h2>Instruction</h2>
                    <p>Search the ingredients you have and plan to use at the search bar. It will then add the ingredients to the box below.</p>
                </div>
                <div ng-app="" ng-controller="IngredientListController">
                    <p>Search for your ingredients:</p>
                    <input ng-keypress="enter($event)" placeholder="Search" list="list" name="search" ng-model="items"/>
                    <datalist id="list">
                        <option value="Apple">
                        <option value="Banana">
                        <option value="Cabbage">
                        <option value="Dandelion">
                        <option value="Egg">
                        <option value="Fennel">
                        <option value="Grape">
                        <option value="Icing">
                        <option value="Jam">
                        <option value="Ketchup">
                    </datalist>
                    <a class="btn btn-default buttoncustom" ng-click="addQuery()">Submit</a>
                    <p>Ingredient Lists:</p>

                    <pre>Ingredients={% raw %} {{ ingredients }} {% endraw %}</pre>
                    <select ng-model="ingredient" ng-options="i as i for i in ingredients" size=10 STYLE="width: 300px">
                        <!--<option ng-repeat="item in ingredients">{% raw %} {{ item }} {% endraw %}</option>-->
                    </select>

                    <p>Selected Ingredients: {% raw %}{{ ingredient }}{% endraw %}</p>

                    <!--<div class="array">
                        <p>Ingredients:</p>
                            <select name="input" multiple="multiple" size=10 width=200 STYLE="width: 200px" ng-controller="IngredientListController">
                                <option value="input">empty</option>
                            </select>-->
                    <a class="btn btn-default" ng-click="remove(ingredient)">Remove</a>
                    <a class="btn btn-default" ng-click="reset()">Reset</a>
                    <button class="btn btn-default" ng-click="open(customer)">{{ customer.name }}</button> <br />

                    <!--MODAL WINDOW-->
                    <script type="text/ng-template" id="myModalContent.html">
                        <div class="modal-header">
                            <h3>The Customer Name is: {{ customer.name }}</h3>
                        </div>
                        <div class="modal-body">
                            This is where the Customer Details Goes<br />
                            {{ customer.details }}
                        </div>
                        <div class="modal-footer">

                        </div>
                    </script>
                </div>
                <div class="description">
                    <p>After putting all your ingredients, click "Generate Meal Plan" button at right to receive your available recipes. It's simple!</p>
                </div>
            </aside>
            <div ng-include="'/recipeViewerApp/recipeViewer/RecipeViewerTemplate.html'"></div>
        </div>
    {% endblock %}
    {% endblock %}