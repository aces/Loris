<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8"/>
<link rel="stylesheet" href="{$baseurl}/{$css}" type="text/css" />
<link rel="stylesheet" href="{$baseurl}/bootstrap/css/bootstrap.min.css">
<!-- shortcut icon that displays on the browser window -->
<link rel="shortcut icon" href="{$baseurl}/images/mni_icon.ico" type="image/ico" />
<!-- page title -->
<title>Request LORIS Account</title>
<!--  end page header -->
</head>

<body>
<div class ="logo">
</div>
    <div class="navbar navbar-default" role="navigation" style="height:90px">
        <div class="container">
            <div class="navbar-brand" style="align:center;">
                {if $study_logo}<img src="{$study_logo}" border="0" width="64" height="57" />{/if}
                {$study_title}
            </div>
        </div>
    </div>
<div class="row panel panel-default col-xs-10 col-xs-offset-1 col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4">
<div class="panel-body">
{if not $success}
<div class="col-xs-12">
<div class="col-xs-12">
    <center>
    <img src="{$baseurl}/images/LORIS_logo.svg" class="img-responsive" alt="Responsive image" onerror="this.src='{$baseurl}/images/LORIS_logo.png'" align="middle" width="92%">
    </center>
    <br>
</div>
<center>
    <h2>Request Account</h2>
    <h3>Please fill in the form below.</h3>
    <h5> We will contact you once your account has been approved.</h5>
</center>
{if $error_message != ""}
    {section name=error loop=$error_message}
        <div class="alert alert-danger">
       {$error_message[error]}
        </div>
    {/section}
{/if}
<form action="process_new_account.php" method="post" name="form1" id="form1" class="form-horizontal">
<div class="form-group">
    <label  class="col-sm-4 control-label" size="75">First Name:</label>
    <div class="col-sm-6">
        <input name="name" type="text" id="name" size="20" />
    </div>
</div>
<div class="form-group">
   <label class="col-sm-4 control-label">Last Name:</label>
    <div class="col-sm-6">
       <input name="lastname" type="text" id="lastname"/>
    </div>
</div>
<div class="form-group">
<label class="col-sm-4 control-label">Email Address: </label>
      <div class="col-sm-6">
         <input name="from" type="text" id="from"/>
     </div>
</div>
<div class="form-group">
<label class="col-sm-4 control-label">Type verification code:</label>
 <div class="col-sm-6">
<input name="verif_box" type="text" id="verif_box" />
<img src="verificationimage.php?num={$rand}" alt="verification image, type it in the box" width="50" height="24" align="absbottom" /><br />
</div>
</div>
<div class="form-group">
            <div class="col-sm-offset-4 col-sm-10">
                <input name="Submit" class="btn btn-primary col-xs-4" type="submit" value="Submit"/>
            </div>
</div>
<div class="row">
                <table class="LorisFooter" align="center" style="position: relative">
                    <tr>
                    <hr width = 70%>
                    </tr>
                    <tr>
                    <!--td align="center" colspan="1"><br><font color="#C40A29">A WebGL-compatible browser is required for full functionality.</font></td-->
                    </tr>       
                    <tr>
                    <td align="center" colspan="1">A WebGL-compatible browser is required for full functionality (Mozilla Firefox, Google Chrome)</td>
                    </tr>   
                    <tr>
                    <td align="center" colspan="1">Powered by LORIS &copy; {$currentyear}. All rights reserved.</td>
                    </tr>   
                    <tr>
                    <td align="center" colspan="1">Created by <a href="http://mcin-cnim.ca" style="color: #064785" target="_blank">MCIN</a></td>
                    </tr>
                    <tr>
                    <td align="center" colspan="1">Developed at <a href="http://www.mni.mcgill.ca" style="color: #064785" target="_blank">Montreal Neurological Institute and Hospital</a></td>

                    </tr>
                </table>
                </div>
</form>
</div>
{/if}
</div></div>
</body>
</html>
