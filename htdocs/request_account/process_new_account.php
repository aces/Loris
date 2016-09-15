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
 *
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
session_start();
$tpl_data = array();

// create an instance of the config object
$config = NDB_Config::singleton();
$DB     = Database::singleton();

$res = array();
$DB->select("SELECT Name, CenterID FROM psc", $res);
$site_list = array();
foreach ($res as $elt) {
    $site_list[$elt["CenterID"]] = $elt["Name"];
}

$tpl_data['baseurl']     = $config->getSetting('url');
$tpl_data['css']         = $config->getSetting('css');
$tpl_data['rand']        = rand(0, 9999);
$tpl_data['success']     = false;
$tpl_data['study_title'] = $config->getSetting('title');
$tpl_data['currentyear'] = date('Y');
$tpl_data['site_list']   = $site_list;

try {
    $tpl_data['study_logo'] = "../".$config->getSetting('studylogo');
} catch(ConfigurationException $e) {
    $tpl_data['study_logo'] = '';
}
try {
    $study_links = $config->getSetting('Studylinks');
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
        $err[] = 'The minimum length for First Name field is 3 characters';
    }
    if (!checkLen('lastname')) {
        $err[] = 'The minimum length for Last Name field is 3 characters';
    }
    if (!checkLen('from')) {
        $err[] = 'Your email is not valid!';
    } else if (!filter_var($_REQUEST['from'], FILTER_VALIDATE_EMAIL) ) {
        $err[] = 'Your email is not valid!';
    }
    if (!checkLen('site', 0)) {
        $err[] = 'The Site field is empty!';
    }
    if (isset($_SESSION['tntcon'])
        && md5($_REQUEST['verif_box']).'a4xn' != $_SESSION['tntcon']
    ) {
        $err[] = 'The verification code is incorrect';
    }

    $fields = array(
               'name'     => 'First Name',
               'lastname' => 'Last Name',
               'from'     => 'Email',
              );

    // For each fields, check if quotes or if some HTML/PHP
    // tags have been entered
    foreach ($fields as $key => $field) {
        $value = $_REQUEST[$key];
        if (preg_match('/["]/', html_entity_decode($value))) {
            $err[] = "You can't use quotes in $field";
        }
        if (strlen($value) > strlen(strip_tags($value))) {
            $err[] = "You can't use tags in $field";
        }
    }

    if (count($err)) {
        $tpl_data['error_message'] = $err;
    }

    if (!count($err)) {
        $name      = htmlspecialchars($_REQUEST["name"], ENT_QUOTES);
        $lastname  = htmlspecialchars($_REQUEST["lastname"], ENT_QUOTES);
        $from      = htmlspecialchars($_REQUEST["from"], ENT_QUOTES);
        $verif_box = htmlspecialchars($_REQUEST["verif_box"], ENT_QUOTES);
        $site      = htmlspecialchars($_REQUEST["site"], ENT_QUOTES);

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
                     'CenterID'         => $site,
                    );
        // check email address' uniqueness
        $result = $DB->pselectOne(
            "SELECT COUNT(*) FROM users WHERE Email = :VEmail",
            array('VEmail' => $from)
        );

        if ($result == 0) {
            // insert into db only if email address if it doesnt exist
            $success = $DB->insert('users', $vals);
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
 * @param integer $len The minimum length - 1 for the parameter
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
