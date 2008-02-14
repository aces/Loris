<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<link rel="stylesheet" href="{$css}" type="text/css" />
<!-- shortcut icon that displays on the browser window -->
<link rel="shortcut icon" href="images/mni_icon.ico" type="image/ico" />
<!-- page title -->
<title>Lost Password</title>
<!--  end page header -->
</head>

<body>

<form action="lost_password.php" target="_self" method="post">
<!-- start main table -->
<table border="0" align="center" bgcolor="#D3DCE3" cellpadding="2" cellspacing="0">
    <tr>
	<th background="images/title_background.jpg" class="banner" colspan="2" align="left">
	    <strong>Montreal Neurological Hospital and Institute</strong>
	</th>
    </tr>
    <tr>
	<!--  mni logo -->
	<td align="left" valign="top" colspan="1" rowspan="1"><img src="images/mni_logo_transparent.gif" border="0" /></td>
	<!-- inner table -->
	<td align="center" valign="center" colspan="1" rowspan="1">
	    <table border="0" align="center" valign="top" bgcolor="#D3DCE3" cellpadding="2" cellspacing="2">
		<tr>
		    <!-- message -->
		    <td align="center" colspan="3">{$error_message}{$confirm}&nbsp;</td>
		</tr>
		<tr>
		    <!-- explanatory note -->
		    <td align="center" colspan="3">Please enter your username below, and a new password will be sent to you.&nbsp;</td>
		</tr>
		<tr>
		    <th align="right">User:</th>
		    <td align="left"><input tabindex="1" type="text" size="40" name="username" /></td>
		    <td align="center" valign="center"><input type="submit" name="submit" value="Submit" class="button" /></td>
		</tr>
                <tr>
                    <td align="center" colspan="3"><a href="main.php">Return to login screen</a></td>
    	    </table>
	</td>
	<!-- end inner table -->
    </tr>
    <tr>
	<td class="tabox" align="left" valign="bottom" colspan="2">
	    Created By: <a href="http:www.bic.mni.mcgill.ca" target="_blank">McConnell Brain Imaging Centre</a>
	</td>
    </tr>
</table>
<!-- end main table -->
</form>

</body>
</html>
