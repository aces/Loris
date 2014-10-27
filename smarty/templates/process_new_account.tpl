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
<div class ="logo">

    </div>
    
    <div class="navbar navbar-default" role="navigation" style="height:90px">
        <div class="container">
            <a class="navbar-brand" href="#" style="align:center;">
                <img src="{$study_logo}" border="0" width="64" height="57" />
                {$study_title}
            </a>
        </div>
    </div>
<div class="row panel panel-default col-xs-10 col-xs-offset-1 col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4">
<div class="panel-body">
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

<div class="col-xs-12">
    <center>
    <img src="../images/LORIS_logo_141007.svg" class="img-responsive" alt="Responsive image" onerror="this.src='images/LORIS_Logo_141007.png'" align="middle" width="92%">
    </center>
    <br>
</div>
<center><h2>Request Account</h2></center>
<h3>Please fill in the form below. We will contact you once your account has been approved.</h3>

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
<br><br><br>
<div class="row">
                <table class="LoginFooter" align="center">
                    <tr>
                    <hr width = 70%>
                    <td width="100%">
                    <ul id="navlist" style="margin-top: 5px; margin-bottom: 2px;">

                    <li id="active">|</li>
                    {foreach from=$studylinks item=link}
                    <li><a href="{$link.url}" target="{$link.windowName}">{$link.label}</a> | </li>
                    {/foreach}

                    </ul>
                    </td>
                    </tr>
                    <tr>
                    <!--td align="center" colspan="1"><br><font color="#C40A29">A WebGL-compatible browser is required for full functionality.</font></td-->
                    </tr>       
                    <tr>
                    <td align="center" colspan="1" style="color:#808080" >A WebGL-compatible browser is required for full functionality (Mozilla Firefox, Google Chrome)</td>
                    </tr>   
                    <tr>
                    <td align="center" colspan="1" style="color:#808080" >Powered by LORIS &copy; {$currentyear}. All rights reserved.</td>
                    </tr>   
                    <tr>
                    <td align="center" colspan="1"style="color: #808080">Created by <a href="http://mcin-cnim.ca" style="color: #064785" target="_blank">MCIN</a></td>
                    </tr>
                    <tr>
                    <td align="center" colspan="1" style="color: #808080"> Developed at <a href="http://www.mni.mcgill.ca" style="color: #064785" target="_blank">Montreal Neurological Institute and Hospital</a></td>

                    </tr>
                </table>
                </div>
</form>
</div>
{/if}
</div></div>
</body>
</html>
