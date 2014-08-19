<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8"/>
<link rel="stylesheet" href="{$css}" type="text/css" />
<link rel="stylesheet" href="../bootstrap-3.1.1/css/bootstrap.css">
<!-- shortcut icon that displays on the browser window -->
<link rel="shortcut icon" href="images/mni_icon.ico" type="image/ico" />
<!-- page title -->
<title>Request LORIS Account</title>
<!--  end page header -->
</head>

<body>
{if not $success}
<div class="col-xs-12">
{if $error_message != ""}
            <p>The following errors have occured while submitting form :

            <ul>
    {section name=error loop=$error_message}
                <li><strong>{$error_message[error]}</strong></li>
    {/section}
            </ul>
{/if}


<h2>Request LORIS Account</h2>
<h3>Please fill in the form below. We will contact you once your account has been approved.</h3>

<form action="process_new_account.php" method="post" name="form1" id="form1" class="form-horizontal">
<div class="form-group">
    <label  class="col-sm-2 control-label" size="75">First Name:</label>
    <div class="col-sm-6">
        <input name="name" type="text" id="name" size="20" />
    </div>
</div>
<div class="form-group">
   <label class="col-sm-2 control-label">Last Name:</label>
    <div class="col-sm-6">
       <input name="lastname" type="text" id="lastname"/>
    </div>
</div>
<div class="form-group">
<label class="col-sm-2 control-label">Email Address: </label>
      <div class="col-sm-6">
         <input name="from" type="text" id="from"/>
     </div>
</div>
<div class="form-group">
<label class="col-sm-2 control-label">Type verification image:</label>
 <div class="col-sm-6">
<input name="verif_box" type="text" id="verif_box" />
<img src="verificationimage.php?num={$rand}" alt="verification image, type it in the box" width="50" height="24" align="absbottom" /><br />
</div>
</div>
<div class="form-group">
            <div class="col-sm-offset-2 col-sm-10">
                <input name="Submit" class="btn btn-default" type="submit" value="Submit"/>
            </div>
</div>

</form>
</div>
{/if}
</body>
</html>
