{% extends 'index.swig' %}

{% block pageContent %}
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
                    </div>
                </td>
                {% endfor %}
            </tr>
        </table>
    </div>

{% endblock %}