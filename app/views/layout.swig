<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE-edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">

		<title>{{ config.app.name }} -- {{ title }}</title>

		<link rel="stylesheet" href="css/style.css">

		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
		<script src="components/bootstrap/dist/js/bootstrap.min.js"></script>
	</head>

	<body>
        {% block content %} {% endblock %}
	</body>
</html>

