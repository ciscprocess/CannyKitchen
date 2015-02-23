{% extends 'layout.swig' %}
{% block content %}
<aside class="sidebar">
    <div class="content">
        <p>Search for your ingredients</p>
        <div id="search">
            <form id="search" action="">
                <input id="search" type="text" placeholder="Search">
                <input id="submit" type="submit" value="Submit">
            </form>
        </div>
    </div>
    <div class="list">
        <p>Ingredients</p>
        <form action="box.asp">
            <select name="ingredients" multiple="multiple" size=10 width=300 STYLE="width: 360px">
                <option value="input">empty</option>
                <option value="input">empty</option>
                <option value="input">empty</option>
                <option value="input">empty</option>
                <option value="input">empty</option>
                <option value="input">empty</option>
                <option value="input">empty</option>
                <option value="input">empty</option>
                <option value="input">empty</option>
                <option value="input">empty</option>
            </select>
        </form>
    </div>
</aside>
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
            <div ng-include="'/recipeViewerApp/recipeViewer/RecipeViewerTemplate.html'"></div>
        </div>
    {% endblock %}

{% endblock %}
