{% extends 'index.swig' %}

{% block pageContent %}
    <div class="home-pane container">
        <h1>
            Your Saved Recipes
        </h1>

        {% if mealplan != '' %}
            {% for recipe in mealplan|sort("created") %}
            <p><b>Meal Plan {{ loop.index }}</b></p>
                {% for r in recipe.recipes %}
                <p>
                    Day {{ loop.index }}: <a href="{{ recipe.recipes[loop.index0].url }}">{{ recipe.recipes[loop.index0].name }}</a>
                </p>
                {% endfor %}
            {% endfor %}
        {% else %}
            <p>You don't have any meal plans saved.</p>
        {% endif %}

    </div>
{% endblock %}