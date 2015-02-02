{% extends 'layout.swig' %}

{% block content %}
    <div class="jumbotron error-container">
        <div>
            <h1 style="display: inline-block;">HTTP 404: Page not found!</h1>
            <span style="margin-left: 15px; font-size: 50px;" class="glyphicon glyphicon-thumbs-down"></span>
        </div>

        <br />

        <p>
            {{ message }}
        </p>
    </div>

{% endblock %}
