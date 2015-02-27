<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE-edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">

		<title>{{ config.app.name }} -- {{ title }}</title>

		<link rel="stylesheet" href="/css/style.css">

        <script src="/components/jquery/jquery.min.js"></script>
		<script src="/components/bootstrap/dist/js/bootstrap.min.js"></script>
        <script src="/components/angular/angular.js"></script>
        <script src="/components/angular-bootstrap/ui-bootstrap-tpls.min.js"></script>
        <script src="/recipeViewerApp/config.js"></script>
        <script src="/recipeViewerApp/recipeViewer/RecipeViewerController.js"></script>
	</head>

	<body>
        {% block content %} {% endblock %}
	</body>
</html>

