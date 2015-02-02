{% extends 'index.swig' %}

{% block pageContent %}
<div class="container">
    <div class="row">
        <div id="signup" class="col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <strong>Sign Up</strong>
                </div>  
                <div class="panel-body" >
                    <form id="signupform" class="form-horizontal" role="form">
                        <div id="signupalert" style="display:none" class="alert alert-danger">
                            <p>Error:</p>
                            <span></span>
                        </div>                                      
                        <div class="form-group">
                            <label for="email" class="col-md-3 control-label">Email</label>
                            <div class="col-md-9">
                                <input type="text" class="form-control" name="email">
                            </div>
                        </div>      
                        <div class="form-group">
                            <label for="username" class="col-md-3 control-label">Username</label>
                            <div class="col-md-9">
                                <input type="text" class="form-control" name="username">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="password" class="col-md-3 control-label">Password</label>
                            <div class="col-md-9">
                                <input type="password" class="form-control" name="password">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="cfmpassword" class="col-md-3 control-label">Confirm Password</label>
                            <div class="col-md-9">
                                <input type="password" class="form-control" name="cfmpassword">
                            </div>
                        </div>                                   
                        <div class="form-group">
                            <div class="col-md-9">
                                <button id="btn-signup" type="button" class="btn btn-info">Sign Up</button>
                            </div>
                        </div>                                                         
                    </form>
                </div>
            </div>                                              
        </div> 
    </div>
</div>
{% endblock %}