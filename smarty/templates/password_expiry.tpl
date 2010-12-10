<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<link rel="stylesheet" href="{$css}" type="text/css" />
<!-- shortcut icon that displays on the browser window -->
<link rel="shortcut icon" href="images/mni_icon.ico" type="image/ico" />
<!-- page title -->
<title>{$title}</title>
</head>

<body>

<form action="{$action}" method="post">

<input type="hidden" name="login" value="true" />
<input type="hidden" name="username" value="{$username}" />

<table align="center" bgcolor="#D3DCE3" border="0" cellpadding="2" cellspacing="0">
    <tr>
    	<th align="left" class="banner" colspan="2" background="images/title_background.jpg">
    	    Montreal Neurological Hospital and Institute
	    </th>
    </tr>
    <tr>
    	<td><img src="images/mni_logo_transparent.gif" alt="Montreal Neurological Institute" border="0" width="128" height="106" /></td>
	    <td>
	        <table border="0" cellpadding="2" cellspacing="2">
            	<tr>
	                <th align="left" class="banner" colspan="3">Password Strength Rules</th>
              	</tr>
                <tr>
                    <td align="left" colspan="3">
            			<ul>
                			    <li>The password must be at least 6 characters long</li>
			                    <li>The password must not contain only letters</li>
                			    <li>The password must not contain only numbers</li>
			                    <li>The password and the user name must not be the same</li>
                			    <li>The password and the email address must not be the same</li>
            			</ul>
	        	    </td>
               	</tr>
        	    <tr>
	        	    <th align="left" class="banner" colspan="3">Update Password</td>
             	</tr>
        		<tr>
		            <td align="center" colspan="2"><span class="error">{$error_message}&nbsp;</span></td>
        		</tr>
	            <tr>
    	     	    <th align="right">New Password:</th>
		            <td align="left"><input name="password" tabindex="1" type="password" /></td>
           		    <td align="center" rowspan="2" valign="center"><input class="button" name="expiry" value="Save" type="submit" /></td>
	            </tr>
    	        <tr>
		            <th align="right">Confirm Password:</td>
	        	    <td align="left"><input name="confirm" tabindex="2" type="password" /></td>
            	</tr>
   	        </table>
    	</td>
    </tr>
    <tr>
    	<td align="left" class="tabox" colspan="2">
    	    Created By: <a href="http:www.bic.mni.mcgill.ca" target="_blank">McConnell Brain Imaging Centre</a>
	    </td>
    </tr>
</table>

</form>

</body>
</html>
