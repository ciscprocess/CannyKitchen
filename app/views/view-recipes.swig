{% extends 'index.swig' %}

{% block pageContent %}
    <form method="post" action="/savedmeals">
        <div class="recipes-container">
            <table>
                <tr>
                    {% for recipe in recipes %}
                    <td>
                        <div class="well" style="margin-right: 2px;">
                            Day {{ start + loop.index }}
                        </div>
                        <div class="well" style="height: 200px; margin-top: -19px; margin-right: 2px;">
                            <img class="recipe-thumbnail" src="{{ recipe.image }}" />
                            <br />
                            <a href="{{ recipe.url || '#' }}"> {{ recipe.name }} </a>
                            <input type="hidden" name="recipename" value="{{ recipe.name }}">
                            <input type="hidden" name="recipeurl" value="{{ recipe.url }}">
                        </div>
                    </td>
                    {% endfor %}
                </tr>
            </table>
        </div>

        {% if name %}
            <button type="submit" class="btn btn-default">Save Meal Plan</button>
        {% endif %}
    </form>

{% endblock %}