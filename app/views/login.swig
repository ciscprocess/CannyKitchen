{% extends 'index.swig' %}

{% block pageContent %}

<!-- Login Form -->
<div class="container">
    <div class="row">
        <div class="col-md-4 col-md-offset-4">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <strong>Log In</strong>
                </div>
                <div class="panel-body">
                    {% if alert == 'yes' %}
                        <div class="alert alert-danger">
                            <strong>Email/password is incorrect!</strong>
                        </div>
                    {% endif %}

                    <!-- Login Form -->
                    <form method="post" action="/login" class="form-horizontal">
                        <div class="form-group">
                            <label class="col-md-3 control-label">Username</label>
                            <div class="col-md-9">
                                <input type="string" class="form-control" id="username" name="username" required="">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="inputPassword" class="col-md-3 control-label">Password</label>
                            <div class="col-md-9">
                                <input type="password" class="form-control" name="password" id="password">
                            </div>
                        </div>
<!--                         <div class="checkbox">
                            <label><input type="checkbox">Remember me</label>
                        </div>
                        <br /> -->
                        <button type="submit" class="btn btn-info" name="submit">Sign In</button>
                    </form>
                </div>
                <div class="panel-footer">Not Registered? <a href="signup">Register here.</a>
                </div>
            </div>
        </div>
    </div>
</div>


{% endblock %}