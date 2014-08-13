<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
<title>Request LORIS Account</title>
<link rel="stylesheet" type="text/css" href="main.css" />
<link rel="stylesheet" href="bootstrap-3.1.1/css/bootstrap.css">
</head>

<body>
<div class="col-xs-12">
<h2>Request LORIS Account</h2>
<h3>Please fill in the form below. We will contact you once your account has been approved.</h3>

<form action="process_new_account.php" method="post" name="form1" id="form1" class="form-horizontal" onsubmit="MM_validateForm('from','','RisEmail','subject','','R','verif_box','','R','message','','R');return document.MM_returnValue">
<div class="form-group">
    <label  class="col-sm-2 control-label" size="75">First Name:</label>
    <div class="col-sm-6">
        <input name="name" type="text" id="name" size="20"  value="<?php echo $_GET['name'];?>"/>
    </div>
</div>
<div class="form-group">
   <label class="col-sm-2 control-label">Last Name:</label>
    <div class="col-sm-6">
       <input name="lastname" type="text" id="lastname" value="<?php echo $_GET['lastname'];?>"/>
    </div>
</div>
<div class="form-group">
<label class="col-sm-2 control-label">Email Address: </label>
      <div class="col-sm-6">
         <input name="from" type="text" id="from" value="<?php echo $_GET['from'];?>"/>
     </div>
</div>
<div class="form-group">              
<label class="col-sm-2 control-label">Type verification image:</label>
 <div class="col-sm-6">
<input name="verif_box" type="text" id="verif_box" />
<img src="verificationimage.php?<?php echo rand(0,9999);?>" alt="verification image, type it in the box" width="50" height="24" align="absbottom" /><br />
</div>
</div>
<!-- if the variable "wrong_code" is sent from previous page then display the error field -->
<?php if(isset($_GET['wrong_code'])){?>
<div style="border:1px solid #990000; background-color:#D70000; color:#FFFFFF; padding:4px; padding-left:6px;width:295px;">Wrong verification code</div><br /> 
<?php ;}?>
  <div class="form-group">
            <div class="col-sm-offset-2 col-sm-10">
                <input name="Submit" class="btn btn-default" type="submit" value="Submit"/>
            </div>
        </div>

</form>
</div>
</body>
</html>
