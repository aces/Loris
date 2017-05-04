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

// Get reCATPCHA keys
$reCAPTCHAPrivate = $config->getSetting('reCAPTCHAPrivate');
$reCAPTCHAPublic  = $config->getSetting('reCAPTCHAPublic');

// Display reCAPTCHA if both private and public keys are set
if ($reCAPTCHAPrivate && $reCAPTCHAPublic) {
    $tpl_data['captcha_key'] = $reCAPTCHAPublic;
}

$tpl_data['baseurl']     = $config->getSetting('url');
$tpl_data['css']         = $config->getSetting('css');
$tpl_data['rand']        = rand(0, 9999);
$tpl_data['success']     = false;
$tpl_data['study_title'] = $config->getSetting('title');
$tpl_data['currentyear'] = date('Y');
$tpl_data['site_list']   = $site_list;
$tpl_data['page']        = 'request_account';
$tpl_data['currentyear'] = date('Y');
$tpl_data['version']     = file_get_contents(__DIR__ . "/../../VERSION");
$tpl_data['form']        = $_REQUEST;
$tpl_data['page_title']  = 'Request LORIS Account';

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

    // Verify reCAPTCHA
    if (isset($_POST['g-recaptcha-response']) && isset($reCAPTCHAPrivate)) {
        $recaptcha = new \ReCaptcha\ReCaptcha($reCAPTCHAPrivate);
        $resp      = $recaptcha->verify(
            $_POST['g-recaptcha-response'],
            $_SERVER['REMOTE_ADDR']
        );
        if (!$resp->isSuccess()) {
            $errors         = $resp->getErrorCodes();
            $err['captcha'] = 'Please complete the reCaptcha!';
        }
    }

    if (!checkLen('name')) {
        $err['name'] = 'The minimum length for First Name field is 3 characters!';
    }
    if (!checkLen('lastname')) {
        $err['lastname'] = 'The minimum length for Last Name field is 3 characters!';
    }
    if (!checkLen('from')) {
        $err['from'] = 'Please provide a valid email!';
    } else if (!filter_var($_REQUEST['from'], FILTER_VALIDATE_EMAIL) ) {
        $err['from'] = 'Please provide a valid email!';
    }
    if (!checkLen('site', 0)) {
        $err['site'] = 'Please choose a site!';
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
            $err[$field] = "You can't use quotes in $field";
        }
        if (strlen($value) > strlen(strip_tags($value))) {
            $err[$field] = "You can't use tags in $field";
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

        // check to see if verification code was correct
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

        if ($_REQUEST['examiner']=='on') {
            $rad =0;
            if ($_REQUEST['radiologist']=='on') {
                $rad =1;
            }
            //insert in DB as inactive until account approved
            $DB->insert(
                'examiners',
                array(
                 'full_name'        => $fullname,
                 'centerID'         => $site,
                 'radiologist'      => $rad,
                 'active'           => 'N',
                 'pending_approval' => 'Y',
                )
            );
        }

        // check email address' uniqueness
        $result = $DB->pselectOne(
            "SELECT COUNT(*) FROM users WHERE Email = :VEmail",
            array('VEmail' => $from)
        );

        if ($result == 0) {
            // insert into DB only if email address doesn't exist
            $success = $DB->insert('users', $vals);
            // Get the ID of the new user and insert into user_psc_rel
            $user_id = $DB->pselectOne(
                "SELECT ID FROM users WHERE Email = :VEmail",
                array('VEmail' => $from)
            );

            $DB->insert(
                'user_psc_rel',
                array(
                 'UserID'   => $user_id,
                 'CenterID' => $site,
                )
            );
        }
        // Show success message even if email already exists for security reasons
        $tpl_data['success'] = true;

        unset($_SESSION['tntcon']);
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
$smarty->display('public_layout.tpl');

ob_end_flush();

exit;

?>
