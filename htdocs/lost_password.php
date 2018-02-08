<?php
/**
 * This implements the lost password page in Loris. It must be
 * separated from main.php because being on the last password page
 * means the user is not logged in, and the main.php will only work
 * for logged in users.
 *
 * PHP Version 5
 *
 * @category Behavioural
 * @package  Loris
 * @author   Loris Team <loris-dev@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
require_once __DIR__ . '/../vendor/autoload.php';
set_include_path(get_include_path().":../project/libraries:../php/libraries:");
require_once __DIR__ . "/../vendor/autoload.php";
ini_set('default_charset', 'utf-8');
ob_start('ob_gzhandler');

require_once "NDB_Client.class.inc";
$client = new NDB_Client();
$client->initialize();

require_once "Email.class.inc";

$tpl_data = array();

// create an instance of the config object
$config          =& NDB_Config::singleton();
$tpl_data['css'] =$config->getSetting('css');
$tpl_data['study_title'] = $config->getSetting('title');
$tpl_data['page']        = 'password-reset';
$tpl_data['currentyear'] = date('Y');
$tpl_data['page_title']  = 'Reset Password';
try {
    $tpl_data['study_logo'] = $config->getSetting('studylogo');
} catch(ConfigurationException $e) {
    $tpl_data['study_logo'] = '';
}

if (isset($_POST['username'])) {

    // create the user object
    $user =& User::singleton($_POST['username']);

    $email = $user->getData('Email');

    // check that it is a valid user
    if (!empty($email)) {

        // check that the email is valid
        if ($user->isEmailValid()) {

            // generate a new password
            $password = User::newPassword();

            // reset the password in the database
            // expire password so user must change it upon login
            $success = $user->updatePassword($password, '1990-04-01');

            // send the user an email
            $msg_data['study']    = $config->getSetting('title');
            $msg_data['url']      = $config->getSetting('url');
            $msg_data['realname'] = $user->getData('Real_name');
            $msg_data['password'] = $password;
            Email::send($email, 'lost_password.tpl', $msg_data);

            $tpl_data['success'] = 'You should receive an email with instructions
                                    within a few minutes!';
        } else {
            $tpl_data['error_message'] = 'Please provide a valid username!';
        }
    } else {
        $tpl_data['error_message'] = "Couldn't find a user with this username!";
    }
}

//Output template using Smarty
$smarty = new Smarty_neurodb;
$smarty->assign($tpl_data);
$smarty->display('public_layout.tpl');

ob_end_flush();

exit;
?>
