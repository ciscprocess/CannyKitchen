{% extends 'index.swig' %}

{% block pageContent %}
<!-- Login Form -->
<div class="container">
    <div class="row">
        <div class="col-md-4 col-md-offset-4">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <strong>Login</strong>
                </div>
                <div class="panel-body">
                    <form class="form-horizontal" role="form">
                        <div class="form-group">
                            <label for="inputEmail" class="col-sm-2 control-label">Email</label>
                            <div class="col-sm-8">
                                <input type="email" class="form-control" id="inputEmail" required="">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="inputPassword" class="col-sm-2 control-label">Password</label>
                            <div class="col-sm-8 col-sm-offset-1">
                                <input type="password" class="form-control" id="inputPassword">
                            </div>
                        </div>
                        <div class="checkbox">
                            <label><input type="checkbox">Remember me</label>
                        </div>
                        <button type="submit" class="btn btn-default">Sign In</button>
                    </form>
                </div>
                <div class="panel-footer">Not Registered? <a href="signup">Register here</a>
                </div>
            </div>
        </div>
    </div>
</div>
{% endblock %}