<?php
set_include_path(get_include_path().":../project/libraries:../php/libraries:");
ini_set('default_charset', 'utf-8');

/**
 * lost password form
 * @package main
 */
ob_start('ob_gzhandler');

require_once "NDB_Client.class.inc";
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize();

require_once "Email.class.inc";

$tpl_data = array();

// create an instance of the config object
$config =& NDB_Config::singleton();
$tpl_data['css']=$config->getSetting('css');
$tpl_data['study_title'] = $config->getSetting('title');
$tpl_data['study_logo']  = "../".$config->getSetting('studylogo');

if (isset($_POST['username'])) {

    // create the user object
    $user =& User::singleton($_POST['username']);
    if (PEAR::isError($user)) {
        $tpl_data['error_message'] = $user->getMessage();
    }

    $email = $user->getData('Email');

    // check that it is a valid user
    if (!empty($email)) {

        // check that the email is valid
        if ($user->isEmailValid()) {

            // generate a new password
            $password = User::newPassword();

            // reset the password in the database
            $success = $user->update(array('Password_md5' => User::md5_salt($password), 'Password_expiry' => '0000-00-00'));
            if (PEAR::isError($success)) {
                $tpl_data['error_message'] = $success->getMessage();
            }

            // send the user an email
            $msg_data['study'] = $config->getSetting('title');
            $msg_data['url'] = $config->getSetting('url');
            $msg_data['realname'] = $user->getData('Real_name');
            $msg_data['password'] = $password;
            Email::send($email, 'lost_password.tpl', $msg_data);

            $tpl_data['confirm'] = $user->getData('Real_name').', you should receive an email within a few minutes.';
    	}

	    else {
            $tpl_data['error_message'] = 'That user has an invalid email address.';
	    }
    }

    else {
        $tpl_data['error_message'] = 'That user is not in the system.';
    }
}

//Output template using Smarty
$smarty = new Smarty_neurodb;
$smarty->assign($tpl_data);
$smarty->display('lost_password.tpl');

ob_end_flush();

exit;
?>
