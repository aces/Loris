<?php
/**
 * This file represents the main entry point into Loris. It does
 * the setup required for every page, and then dispatches to the
 * appropriate Loris module.
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Loris
 * @author   Loris Team <loris-dev@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

set_include_path(get_include_path().":../project/libraries:../php/libraries:");
require_once __DIR__ . "/../vendor/autoload.php";
ini_set('default_charset', 'utf-8');
ob_start('ob_gzhandler');
// Create an output buffer to capture console output, separately from the
// gzip handler.
ob_start();
// start benchmarking
$timer = new Benchmark_Timer;
$timer->start();

// load the client
$client = new NDB_Client;
$client->initialize();

// require additional libraries

$TestName = isset($_REQUEST['test_name']) ? $_REQUEST['test_name'] : 'dashboard';
$subtest  = isset($_REQUEST['subtest']) ? $_REQUEST['subtest'] : '';
// make local instances of objects
$config =& NDB_Config::singleton();

$timer->setMarker('Loaded client');
//--------------------------------------------------

/**
 * Extracts a parameter from request in a safe way,
 * and sets the $tpl_data to said request. If request does
 * not contain parameter, will set the smarty variable to
 * empty
 *
 * @param string $param The $_REQUEST parameter to convert to a smarty variable
 *
 * @return none, side effect of modifying $tpl_data
 */
function tplFromRequest($param)
{
    global $tpl_data;
    if (isset($_REQUEST[$param])) {
        $tpl_data[$param] = $_REQUEST[$param];
    } else {
        $tpl_data[$param] = '';
    }
}

// set URL params
$tpl_data['currentyear'] = date('Y');
$tpl_data['test_name']   = $TestName;
$tpl_data['subtest']     = $subtest;
tplFromRequest('candID');
tplFromRequest('sessionID');
tplFromRequest('commentID');
tplFromRequest('dynamictabs');

$www = $config->getSetting('www');
$tpl_data['baseurl'] = $www['url'];
// study title
$tpl_data['study_title'] = $config->getSetting('title');
// draw the user information table
try {
    $user =& User::singleton();
    $tpl_data['user'] = $user->getData();
    $tpl_data['user']['permissions']   = $user->getPermissions();
    $tpl_data['hasHelpEditPermission'] = $user->hasPermission('context_help');

    $site =& Site::singleton($user->getData('CenterID'));
    $tpl_data['user']['user_from_study_site'] = $site->isStudySite();
} catch(Exception $e) {
    $tpl_data['error_message'][] = "Error: " . $e->getMessage();
}

// the the list of tabs, their links and perms
$tpl_data['tabs'] = NDB_Config::GetMenuTabs();
$timer->setMarker('Drew user information');

//--------------------------------------------------

// configure browser args for the mri browser
// !!! array URL args -- need to correct query in mri_browser to
// accept candidate data
$argstring = '';
if (!empty($_REQUEST['candID'])) {
    $argstring .= "filter%5BcandID%5D=".$_REQUEST['candID']."&";
}

if (!empty($_REQUEST['sessionID'])) {
    try {
        $timePoint  =& TimePoint::singleton($_REQUEST['sessionID']);
        $argstring .= "filter%5Bm.VisitNo%5D=".$timePoint->getVisitNo()."&";
    } catch (Exception $e) {
        $tpl_data['error_message'][]
            = "TimePoint Error (".$_REQUEST['sessionID']."): ".$e->getMessage();
    }
}

$link_args['MRIBrowser'] = $argstring;

$timer->setMarker('Configured browser arguments for the MRI browser');

//--------------------------------------------------

$paths = $config->getSetting('paths');

if (!empty($TestName)) {
    if (file_exists($paths['base'] . "modules/$TestName/js/$TestName.js")) {
        if (strpos($_SERVER['REQUEST_URI'], "main.php") === false) {
            $tpl_data['test_name_js'] = "js/$TestName.js";
        } else {
            $tpl_data['test_name_js'] = "GetJS.php?Module=$TestName";
        }
    } elseif (file_exists($paths['base'] . "htdocs/js/modules/$TestName.js")) {
        // Old style, this should be removed after all modules are modularized.
        $tpl_data['test_name_js'] = "js/modules/$TestName.js";
    }

    // Get CSS for a module
    if (file_exists($paths['base'] . "modules/$TestName/css/$TestName.css")) {
        if (strpos($_SERVER['REQUEST_URI'], "main.php") === false) {
            $tpl_data['test_name_css'] = "css/$TestName";
        } else {
            $tpl_data['test_name_css'] = "GetCSS.php?Module=$TestName";
        }
    }

    // Used for CSS for a specific instrument.
    if (file_exists($paths['base'] . "project/instruments/$TestName.css")) {
        if (strpos($_SERVER['REQUEST_URI'], "main.php") === false) {
            $tpl_data['test_name_css'] = "css/instruments/$TestName.css";
        } else {
            $tpl_data['test_name_css'] = "GetCSS.php?Instrument=$TestName";
        }
    }
}

//--------------------------------------------------

// get candidate data
if (!empty($_REQUEST['candID'])) {
    try {
        $candidate =& Candidate::singleton($_REQUEST['candID']);
        $tpl_data['candidate'] = $candidate->getData();
    } catch(Exception $e) {
        $tpl_data['error_message'][] = $e->getMessage();
    }
}

// get time point data
if (!empty($_REQUEST['sessionID'])) {
    try {
        $timePoint =& TimePoint::singleton($_REQUEST['sessionID']);
        if ($config->getSetting("SupplementalSessionStatus")) {
            $tpl_data['SupplementalSessionStatuses'] = true;
        }
        $tpl_data['timePoint'] = $timePoint->getData();
    } catch(Exception $e) {
        $tpl_data['error_message'][]
            = "TimePoint Error (".$_REQUEST['sessionID']."): ".$e->getMessage();
    }

}

$timer->setMarker('Drew the top workspace tables');

//--------------------------------------------------

// load the menu or instrument
try {
    $caller    =& NDB_Caller::singleton();
    $workspace = $caller->load($TestName, $subtest);
    if (isset($caller->controlPanel)) {
        $tpl_data['control_panel'] = $caller->controlPanel;
    }
    $tpl_data['workspace'] = $workspace;
} catch(ConfigurationException $e) {
    header("HTTP/1.1 500 Internal Server Error");
    $tpl_data['error_message'][] = $e->getMessage();
} catch(DatabaseException $e) {
    header("HTTP/1.1 500 Internal Server Error");
    $tpl_data['error_message'][] = $e->getMessage();
    $tpl_data['error_message'][] = "Query: <pre>" . $e->query . "</pre>";
    $tpl_data['error_message'][] = "Bind parameters: " . print_r($e->params, true);
    $tpl_data['error_message'][] = "Stack Trace: <pre>"
        . $e->getTraceAsString()
        . "</pre>";
} catch(Exception $e) {
    switch($e->getCode()) {
    case 404: header("HTTP/1.1 404 Not Found");
        break;
    case 403: header("HTTP/1.1 403 Forbidden");
        break;
    }
    $tpl_data['error_message'][] = $e->getMessage();
}

$timer->setMarker('Drew main workspace');

//--------------------------------------------------

try {
    $breadcrumb = new NDB_Breadcrumb;
    $crumbs     = $breadcrumb->getBreadcrumb();

    $tpl_data['crumbs'] = $crumbs;
    parse_str($crumbs[0]['query'], $parsed);
    if (isset($parsed['test_name'])) {
        $tpl_data['top_level'] = $parsed['test_name'];
    } else {
        $tpl_data['top_level'] = '';
    }
} catch(Exception $e) {
    $tpl_data['error_message'][] = $e->getMessage();
}

$timer->setMarker('Drew breadcrumbs');

//--------------------------------------------------


// show the back button
$tpl_data['lastURL'] = $_SESSION['State']->getLastURL();

// bug tracking link
$tpl_data['mantis_url'] = $config->getSetting('mantis_url');


//Display the links, as specified in the config file
$links =$config->getSetting('links');
foreach (Utility::toArray($links['link']) AS $link) {
    $LinkArgs = '';
    $BaseURL  = $link['@']['url'];
    if (isset($link['@']['args'])) {
        $LinkArgs = $link_args[$link['@']['args']];
    }
    $LinkLabel           = $link['#'];
    $WindowName          = md5($link['@']['url']);
    $tpl_data['links'][] =array(
                           'url'        => $BaseURL . $LinkArgs,
                           'label'      => $LinkLabel,
                           'windowName' => $WindowName,
                          );
}


if ($config->getSetting("sandbox") === '1') {
    $tpl_data['sandbox'] = true;
}

// Assign the console output to a variable, then stop
// capturing output so that smarty can render
$tpl_data['console'] = htmlspecialchars(ob_get_contents());
ob_end_clean();


//Output template using Smarty
$tpl_data['css'] = $config->getSetting('css');

$smarty = new Smarty_neurodb;
$smarty->assign($tpl_data);
$smarty->display('main.tpl');

$timer->setMarker('Compiled HTML page');

//--------------------------------------------------



ob_end_flush();

// timer
$timer->stop();
if ($config->getSetting('showTiming')) {
    // display timer
    $timer->display();
}

//print '<pre>'; print_r($tpl_data); print '</pre>';
?>
