<?php
set_include_path(get_include_path().":../project/libraries:../php/libraries:");
ini_set('default_charset', 'utf-8');

/**
 * lost password form
 * @package main
 */
ob_start('ob_gzhandler');

require_once "Database.class.inc";
require_once "Utility.class.inc";
require_once 'NDB_Config.class.inc';
require_once 'NDB_Client.class.inc';
$config =& NDB_Config::singleton();
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize();

$DB =& Database::singleton();
if (Utility::isErrorX($DB)) {
     return("Could not connect to database: ".$DB->getMessage());
}
$tpl_data = array();

// create an instance of the config object
$config =& NDB_Config::singleton();
$tpl_data['css']=$config->getSetting('css');
$tpl_data['rand'] = rand(0, 9999);
$tpl_data['success'] = false;
$err = array();
if(!checkLen('name'))
$err[]='The First name field is empty!';

if(!checkLen('lastname'))
$err[]='The Last name field is empty!';

if(!checkLen('from'))
$err[]='The email field is empty!';
else if(!checkEmail($_REQUEST['from']))
$err[]='Your email is not valid!';
if(count($err))
{
	$tpl_data['error_message'] = $err;
}

if (!count($err)) {
/*
	$err = array();
	if(!checkLen('name'))
		$err[]='The First name field is empty!';

	if(!checkLen('lastname'))
		$err[]='The Last name field is empty!';

	if(!checkLen('from'))
		$err[]='The email field is empty!';
	else if(!checkEmail($_REQUEST['from']))
		$err[]='Your email is not valid!';
	if(count($err))
	{
            $tpl_data['error_message'] = $err;
	}
*/
	$name = $_REQUEST["name"];
	$lastname = $_REQUEST["lastname"];
	$from = $_REQUEST["from"];
	$verif_box = $_REQUEST["verif_box"];

	// remove the backslashes that normally appears when entering " or '
	$name = stripslashes($name); 
	$lastname = stripslashes($lastname); 
	$from = stripslashes($from); 

	// check to see if verificaton code was correct
	if(md5($verif_box).'a4xn' == $_COOKIE['tntcon']){
		// if verification code was correct send the message and show this page
		$fullname = $name." ".$lastname;
		$vals = array('UserID'=>$from, 'Real_name'=>$fullname, 'First_name'=>$name, 'Last_name'=>$lastname,'Pending_approval'=>1,'Email'=>$from);
		// check email address' uniqueness
		$result = $DB->pselectOne("SELECT COUNT(*) FROM users WHERE Email = :VEmail",
				array('VEmail' => $from));
		if (Utility::isErrorX($result)) {
			return PEAR::raiseError("DB Error: ".$result->getMessage());
		}

		if ($result > 0) {
			echo 'The email address already exists';
			exit;
		}

		$success = $DB->insert('users', $vals);
		if (Utility::isErrorX($success)) {
			return PEAR::raiseError("DB Error: ".$success->getMessage());
		} 
                $tpl_data['success'] = true;
		// delete the cookie so it cannot sent again by refreshing this page
		setcookie('tntcon','');
	} else {
		// if verification code was incorrect then return to contact page and show error
                $tpl_data['wrong_code'] = true;
		header("Location:".$_SERVER['HTTP_REFERER']."?from=$from&wrong_code=true");
		exit;
	}

}
function checkLen($str,$len=2)
{
        return isset($_REQUEST[$str]) && mb_strlen(strip_tags($_REQUEST[$str]),"utf-8") > $len;
}

function checkEmail($str)
{
        return preg_match("/^[\.A-z0-9_\-\+]+[@][A-z0-9_\-]+([.][A-z0-9_\-]+)+[A-z]{1,4}$/", $str);
}

//Output template using Smarty
$smarty = new Smarty_neurodb;
$smarty->assign($tpl_data);
$smarty->display('process_new_account.tpl');

ob_end_flush();

exit;

?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!--html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
<title>PHP Contact Form Redirect</title>
</head>

<body>
</body>
</html-->
