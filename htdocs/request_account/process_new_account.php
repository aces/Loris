<?php
/**
 * This file contains code to process user input from
 * Request Account form
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Loris
 * @author   Rathi Gnanasekaran <sekaranrathi@gmail.com>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
require_once __DIR__ . '/../../vendor/autoload.php';
set_include_path(get_include_path().":../../project/libraries:../../php/libraries:");
ini_set('default_charset', 'utf-8');
/**
 * Request LORIS account form
 * @package main
 */
//session_start();
ob_start('ob_gzhandler');
// path to config file
$configFile = "../../project/config.xml";

require_once "Database.class.inc";
require_once "Utility.class.inc";
require_once 'NDB_Config.class.inc';
require_once 'NDB_Client.class.inc';
//$config =& NDB_Config::singleton();
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize($configFile);

$DB = Database::singleton();
if (Utility::isErrorX($DB)) {
     return("Could not connect to database: ".$DB->getMessage());
}
session_start();
$tpl_data = array();

// create an instance of the config object
$config           = NDB_Config::singleton();
$tpl_data['css']  = "../".$config->getSetting('css');
$tpl_data['rand'] = rand(0, 9999);
$tpl_data['success']     = false;
$tpl_data['study_title'] = $config->getSetting('title');
$tpl_data['currentyear'] = date('Y');
try {
    $tpl_data['study_logo'] = "../".$config->getSetting('studylogo');
} catch(ConfigurationException $e) {
    $tpl_data['study_logo'] = '';
}
try {
    $study_links = $config->getSetting('Studylinks');// print_r($study_links);
    foreach (Utility::toArray($study_links['link']) AS $link) {
        $LinkArgs = '';
        $BaseURL  = $link['@']['url'];
        if (isset($link['@']['args'])) {
            $LinkArgs = $link_args[$link['@']['args']];
        }
        $LinkLabel  = $link['#'];
        $WindowName = md5($link['@']['url']);
        $tpl_data['studylinks'][] = array(
                                     'url'        => $BaseURL . $LinkArgs,
                                     'label'      => $LinkLabel,
                                     'windowName' => $WindowName,
                                    );
    }
} catch(ConfigurationException $e) {
}

$err = array();
if ($_SERVER['REQUEST_METHOD'] == "POST") {
    if (!checkLen('name')) {
        $err[] = 'The First Name field is empty!';
    }
    if (!checkLen('lastname')) {
         $err[] = 'The Last Name field is empty!';
    }
    if (!checkLen('from')) {
          $err[] = 'The Email Address field is empty!';
    } else if (!filter_var($_REQUEST['from'], FILTER_VALIDATE_EMAIL) ) {
          $err[] = 'Your email is not valid!';
    }
    if (isset($_SESSION['tntcon'])
        && md5($_REQUEST['verif_box']).'a4xn' != $_SESSION['tntcon']
    ) {
        $err[] = 'The verification code is incorrect';
    }
    if (count($err)) {
        $tpl_data['error_message'] = $err;
    }

    if (!count($err)) {
        $name      = $_REQUEST["name"];
        $lastname  = $_REQUEST["lastname"];
        $from      = $_REQUEST["from"];
        $verif_box = $_REQUEST["verif_box"];

        // check to see if verificaton code was correct
        // if verification code was correct send the message and show this page
        $fullname = $name." ".$lastname;
        $vals     = array(
                     'UserID'           => $from,
                     'Real_name'        => $fullname,
                     'First_name'       => $name,
                     'Last_name'        => $lastname,
                     'Pending_approval' => 'Y',
                     'Email'            => $from,
                    );
        // check email address' uniqueness
        $result = $DB->pselectOne(
            "SELECT COUNT(*) FROM users WHERE Email = :VEmail",
            array('VEmail' => $from)
        );
        if (Utility::isErrorX($result)) {
            return PEAR::raiseError("DB Error: ".$result->getMessage());
        }

        if ($result == 0) {
            // insert into db only if email address if it doesnt exist
            $success = $DB->insert('users', $vals);
            if (Utility::isErrorX($success)) {
                return PEAR::raiseError("DB Error: ".$success->getMessage());
            }
        }
        unset($_SESSION['tntcon']);
        //redirect to a new page
        header("Location: thank-you.html", true, 301);
        exit();

    }
}

/**
 * Check that the user input for a field meets minimum length requirements
 *
 * @param string  $str The request parameter to check
 * @param integer $len The minimum length for the parameter
 *
 * @return True if the parameter was sent and meets minimum length, false
 *         otherwise
 */
function checkLen($str, $len=2)
{
    return isset($_REQUEST[$str])
           && mb_strlen(strip_tags($_REQUEST[$str]), "utf-8") > $len;
}


//Output template using Smarty
$smarty = new Smarty_neurodb;
$smarty->assign($tpl_data);
$smarty->display('process_new_account.tpl');

ob_end_flush();

exit;

?>
