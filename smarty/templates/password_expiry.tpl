<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8"/>
<link rel="stylesheet" href="bootstrap/css/bootstrap.min.css">
<!-- shortcut icon that displays on the browser window -->
<link rel="shortcut icon" href="images/mni_icon.ico" type="image/ico" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<!-- page title -->
<title>{$title}</title>
</head>

<body>

<div class="navbar navbar-default" role="navigation">
    <div class="container">
        <center class="navbar-brand">
            Montreal Neurological Hospital and Institute
        </center>
    </div>
</div>


<form action="{$action}" method="post">
    <div class="row">
        <div class="col-xs-12">
            <div class="col-sm-2 col-xs-3 col-sm-offset-2">
                <img src="images/mni_logo_transparent.gif" class="img-responsive" alt="Responsive image" align="left">
            </div>
            <div class="col-sm-6 col-xs-9">
                <strong>
                    Password Strength Rules
                </strong>
                <ul>
                    <li>
                        The password must be at least 8 characters long
                    </li>
                    <li>
                        The password must contain at least 1 letter, 1 number and 1 character from !@#$%^&amp;*()
                    </li>
                    <li>
                        The password and the user name must not be the same
                    </li>
                    <li>
                        The password and the email address must not be the same
                    </li>
                </ul>
                <strong>
                    Update Password
                </strong>
                <br><br>
                <div class="col-xs-12">
                    {if $error_message}
                        <div class="form-group has-error">
                            <label class="control-label">
                                {$error_message}
                            </label>
                        </div>
                    {/if}
                    <div class="form-group col-xs-12">
                        <label class="col-xs-4">
                            New Password:
                        </label>
                        <div class="col-xs-6">
                            <input class="form-control input-sm" name="password" tabindex="1" type="password" />
                        </div>
                    </div>
                    <div class="form-group col-xs-12">
                        <label class="col-xs-4">
                            Confirm Password:
                        </label>
                        <div class="col-xs-6">
                            <input class="form-control input-sm" name="confirm" tabindex="2" type="password" />
                        </div>
                    </div>
                    <div class="form-group col-xs-12">
                        <div class="col-xs-4">
                            <input class="btn btn-sm btn-primary col-xs-12" name="expiry" value="Save" type="submit" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-xs-10 col-sm-8 col-sm-offset-2">
                Created By: <a href="http:www.bic.mni.mcgill.ca" target="_blank">McConnell Brain Imaging Centre</a>
            </div>
        </div>
    </div>

<input type="hidden" name="login" value="true" />
<input type="hidden" name="username" value="{$username}" />

</form>

</body>
</html>
