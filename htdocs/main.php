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
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
    header("Access-Control-Allow-Credentials: true");
}
set_include_path(get_include_path().":../project/libraries:../php/libraries:");
require_once __DIR__ . "/../vendor/autoload.php";
ini_set('default_charset', 'utf-8');

ob_start('ob_gzhandler');
// Create an output buffer to capture console output, separately from the
// gzip handler.
ob_start();

// load the client
$client    = new NDB_Client;
$anonymous = $client->initialize() === false;
// The NDB_Client->initialize() prints a bunch of garbage, so flush the
// output buffer to throw it away.
ob_flush();

if ($anonymous === false) {
    $TestName = $_REQUEST['test_name'] ?? 'dashboard';
    $subtest  = $_REQUEST['subtest'] ?? '';
} else {
    $TestName = $_REQUEST['test_name'] ?? 'login';
    $subtest  = $_REQUEST['subtest'] ?? '';
}
// make local instances of objects
$config =& NDB_Config::singleton();

//--------------------------------------------------

/**
 * Extracts a parameter from request in a safe way,
 * and sets the $tpl_data to said request. If request does
 * not contain parameter, will set the smarty variable to
 * empty
 *
 * @param string $param The $_REQUEST parameter to convert to a smarty variable
 *
 * @return void (side effect of modifying $tpl_data)
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
$tpl_data['version']     = file_get_contents(__DIR__ . "/../VERSION");


$factory  = NDB_Factory::singleton();
$settings = $factory->settings();

$baseURL = $settings->getBaseURL();
$tpl_data['baseurl'] = $baseURL;

// study title
$tpl_data['study_title'] = $config->getSetting('title');

if (!$anonymous) {
    tplFromRequest('candID');
    tplFromRequest('sessionID');
    tplFromRequest('commentID');
    tplFromRequest('dynamictabs');
    // draw the user information table
    try {
        $user =& User::singleton();

        $site_arr = $user->getData('CenterIDs');
        foreach ($site_arr as $key=>$val) {
            $site[$key]        = & Site::singleton($val);
            $isStudySite[$key] = $site[$key]->isStudySite();
        }
        $oneIsStudySite = in_array("1", $isStudySite);

        $tpl_data['user'] = $user->getData();
        $tpl_data['user']['permissions'] = $user->getPermissions();

        $tpl_data['hasHelpEditPermission']
            = $user->hasPermission('context_help');

        $tpl_data['user']['user_from_study_site'] = $oneIsStudySite;
        $tpl_data['userNumSites']         = count($site_arr);
        $tpl_data['user']['SitesTooltip'] = str_replace(
            ";",
            "<br/>",
            $user->getData('Sites')
        );
    } catch(Exception $e) {
        $tpl_data['error_message'][] = "Error: " . $e->getMessage();
    }

    // the the list of tabs, their links and perms
    $tpl_data['tabs'] = NDB_Config::GetMenuTabs();

    //--------------------------------------------------
}
$paths = $config->getSetting('paths');

if (!empty($TestName)) {
    $base = $paths['base'];

    if (!empty($_REQUEST['sessionID'])) {
        try {
            $timePoint = TimePoint::singleton($_REQUEST['sessionID']);
        } catch (Exception $e) {
            $tpl_data['error_message'][] = htmlspecialchars($e->getMessage());
        }
    }

    $paths = $config->getSetting('paths');

    // get candidate data
    if (!empty($_REQUEST['candID'])) {
        try {
            $candidate =& Candidate::singleton($_REQUEST['candID']);
            $tpl_data['candidate'] = $candidate->getData();
        } catch(Exception $e) {
            $tpl_data['error_message'][] = htmlspecialchars($e->getMessage());
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
            $tpl_data['error_message'][] = htmlspecialchars($e->getMessage());
        }
    }
}

//--------------------------------------------------

// load the menu or instrument
try {
    $caller    =& NDB_Caller::singleton();
    $workspace = $caller->load($TestName, $subtest, '', null, $anonymous);

    if (isset($caller->page->FormAction)) {
        $tpl_data['FormAction'] = $caller->page->FormAction;
    }
    if (isset($caller->controlPanel)) {
        $tpl_data['control_panel'] = $caller->controlPanel;
    }
    if (isset($caller->feedbackPanel)) {
        if (!isset($user)) {
            throw new Exception(401);
        }
        if ($user->hasPermission('bvl_feedback')) {
            $tpl_data['bvl_feedback']   = NDB_BVL_Feedback::bvlFeedbackPossible(
                $TestName
            );
            $tpl_data['feedback_panel'] = $caller->feedbackPanel;
        }
    }
    if (isset($caller->page)) {
        $tpl_data['jsfiles']  = $caller->page->getJSDependencies();
        $tpl_data['cssfiles'] = $caller->page->getCSSDependencies();

        if (!$anonymous) {
            $tpl_data['breadcrumbs'] = $caller->page->getBreadcrumbs();
        }
    }
    $tpl_data['workspace'] = $workspace;
} catch(ConfigurationException $e) {
    header("HTTP/1.1 500 Internal Server Error");
    $tpl_data['error_message'][] = htmlspecialchars($e->getMessage());
} catch(DatabaseException $e) {
    header("HTTP/1.1 500 Internal Server Error");
    $tpl_data['error_message'][] = htmlspecialchars($e->getMessage());
    $tpl_data['error_message'][] = "Query: <pre>" .
                               htmlspecialchars($e->query) . "</pre>";
    $tpl_data['error_message'][] = "Bind parameters: " . print_r($e->params, true);
    $tpl_data['error_message'][] = "Stack Trace: <pre>"
        . htmlspecialchars($e->getTraceAsString())
        . "</pre>";
} catch(Exception $e) {
    switch($e->getMessage()) {
    case 404:
        header("HTTP/1.1 404 Not Found");
        $errorPage = new Smarty_neurodb;
        $errorPage->assign($tpl_data);
        $tpl_data['workspace'] = $errorPage->fetch('404.tpl');
        break;
    case 403:
        header("HTTP/1.1 403 Forbidden");
        $errorPage = new Smarty_neurodb;
        $errorPage->assign($tpl_data);
        $tpl_data['workspace'] = $errorPage->fetch('403.tpl');
        break;
    case 401:
        header("HTTP/1.1 401 Unauthorized");
        $errorPage = new Smarty_neurodb;
        $errorPage->assign($tpl_data);
        $tpl_data['workspace'] = $errorPage->fetch('401.tpl');
        break;
    default:
        header("HTTP/1.1 500 Internal Server Error");
        $tpl_data['error_message'][] = htmlspecialchars($e->getMessage());
        $errorPage = new Smarty_neurodb;
        $errorPage->assign($tpl_data);
        $tpl_data['workspace'] = $errorPage->fetch('500.tpl');
        break;
    }
} finally {
    // Set dependencies if they are not set
    if (!isset($tpl_data['jsfiles']) || !isset($tpl_data['cssfiles'])) {
        $page = (new NDB_Page(new Module('', ''), '', '', '', ''));
        $tpl_data['jsfiles']  = $page->getJSDependencies();
        $tpl_data['cssfiles'] = $page->getCSSDependencies();
    }
}

// show the back button
$tpl_data['lastURL'] = $_SESSION['State']->getLastURL();

// bug tracking link
$tpl_data['issue_tracker_url'] = $config->getSetting('issue_tracker_url');


//Display the links, as specified in the config file
$links =$config->getExternalLinks('FooterLink');

foreach ($links as $label => $url) {
    $WindowName = md5($url);

    $tpl_data['links'][] = array(
                            'url'        => $url,
                            'label'      => $label,
                            'windowName' => $WindowName,
                           );
}


if ($config->getSetting("sandbox") === '1') {
    $tpl_data['sandbox'] = true;
}

// This should be array_filter, but to have access to both key and value
// in array_filter we need to require PHP >= 5.6
$realPerms = array();
if (!$anonymous) {
    foreach ($user->getPermissions() as $permName => $hasPerm) {
        if ($hasPerm === true) {
            $realPerms[] = $permName;
        }
    }
    $tpl_data['userPerms']   = $realPerms;
    $tpl_data['studyParams'] = array(
                                'useEDC'      => $config->getSetting('useEDC'),
                                'useProband'  => $config->getSetting('useProband'),
                                'useFamilyID' => $config->getSetting('useFamilyID'),
                                'useConsent'  => $config->getSetting('useConsent'),
                               );
    $tpl_data['jsonParams']  = json_encode(
        array(
         'BaseURL'   => $tpl_data['baseurl'],
         'TestName'  => $tpl_data['test_name'],
         'Subtest'   => $tpl_data['subtest'],
         'CandID'    => $tpl_data['candID'],
         'SessionID' => $tpl_data['sessionID'],
         'CommentID' => $tpl_data['commentID'],
        )
    );
}

$tpl_data['css'] = $config->getSetting('css');

//--------------------------------------------------

//Output template using Smarty
// Assign the console output to a variable, then stop
// capturing output so that smarty can render
$tpl_data['console'] = htmlspecialchars(ob_get_contents());
ob_end_clean();
switch(isset($_REQUEST['format']) ? $_REQUEST['format'] : '') {
case 'json':
    print $tpl_data['workspace'];
    break;
default:
    $smarty = new Smarty_neurodb;
    $smarty->assign($tpl_data);
    if (!$anonymous) {
        $smarty->display('main.tpl');
    } else {
        $smarty->display('public_layout.tpl');
    }
}
ob_end_flush();

