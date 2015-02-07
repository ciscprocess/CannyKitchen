{% extends 'layout.swig' %}

{% block content %}
    <div class="container">
        <div class="jumbotron error-container">
            <div>
                <h1 style="display: inline-block;">HTTP {{ code }}: {{ message }}!   :'(</h1>
            </div>

            <br />

            <p>
                {{ humanMessage }}
            </p>
        </div>
    </div>
{% endblock %}
