<?php
/**
 * @package mri
 */
ob_start('ob_gzhandler');

// start benchmarking
require_once "Benchmark/Timer.php";
$timer = new Benchmark_Timer;
$timer->start();

require_once "NDB_Client.class.inc";
$client = new NDB_Client();
$client->initialize();

require_once "MRIFile.class.inc";
require_once "Notify.class.inc";
require_once "MRIViewScansPage.class.inc";
require_once "MRIMenuPage.class.inc";

// create Database object
$DB = Database::singleton();
if(PEAR::isError($DB)) {
    print "Could not connect to database: ".$DB->getMessage()."<br>\n";
    die();
}

// user is logged in, let's continue with the show...
$user =& User::singleton();
if(PEAR::isError($user)) {
    die("Error creating user object: ".$user->getMessage());
}

// two levels of display are available: if nothing else, show a list
// of candidates (with a filter tool).  if $ID_session (or $CandID
// and $VisitNo) are specified, show the volumes available for that
// candidate of type $datatype.  $datatype will default to native [mnc]

$config =& NDB_Config::singleton();
$tpl_data['study_title']=$config->getSetting('title');
$tpl_data['mantis']=$config->getSetting('mantis_url');
$tpl_data['efax']=$config->getSetting('efax');

$tpl_data['css']=$config->getSetting('css');
$tpl_data['user_full_name']=$user->getData('Real_name');
$tpl_data['user_site_name']=$user->getData('Site');

$tpl_data['sessionID'] = $_REQUEST['sessionID'];
$tpl_data['commentID'] = $_REQUEST['commentID'];
$tpl_data['candID']    = $_REQUEST['candID'];

// the the list of tabs, their links and perms
$mainMenuTabs = $config->getSetting('main_menu_tabs');

foreach(Utility::toArray($mainMenuTabs['tab']) AS $myTab){
    $tpl_data['tabs'][]=$myTab;
    foreach(Utility::toArray($myTab['subtab']) AS $mySubtab)
    {
        // skip if inactive
        if ($mySubtab['visible']==0) continue;
        // replace spec chars
        $mySubtab['link'] = str_replace("%26","&",$mySubtab['link']);

        // check for the restricted site access
        if (isset($site) && ($mySubtab['access']=='all' || $mySubtab['access']=='site' && $site->isStudySite())) {

            // if there are no permissions, allow access to the tab
            if (!is_array($mySubtab['permissions']) || count($mySubtab['permissions'])==0) {
                $tpl_data['subtab'][]=$mySubtab;
            } else {

                // if any one permission returns true, allow access to the tab
                foreach ($mySubtab["permissions"] as $permissions) {

                    // turn into an array
                    if (!is_array($permissions)) $permissions = array($permissions);

                    // test and grant access to button with 1st permission
                    foreach ($permissions as $permission) {
                        if ($user->hasPermission($permission)) {
                            $tpl_data['subtab'][]=$mySubtab;
                            break 2;
                        }
                        unset($permission);
                    }
                    unset($permissions);
                }
            }
        }
        unset($mySubtab);
    } // end foreach
}

//Display the links, as specified in the config file
$links=$config->getSetting('links');
foreach(Utility::toArray($links['link']) AS $link){
    $BaseURL = $link['@']['url'];
    if(isset($link['@']['args'])) {
        $LinkArgs = $link_args[$link['@']['args']];
    }
    $LinkLabel = $link['#'];
    $WindowName = md5($link['@']['url']);
    $tpl_data['links'][]=array(
        'url'        => $BaseURL . $LinkArgs,
        'label'      => $LinkLabel,
        'windowName' => $WindowName
    );
}   

/* VISIT LISTING
*/

$timer->setMarker('setup');
$selectedTypeID = $DB->selectOne("SELECT ParameterTypeID FROM parameter_type WHERE Name='Selected' LIMIT 1");
$acqDateParamTypeID = $DB->selectOne("SELECT ParameterTypeID FROM parameter_type WHERE Name='acquisition_date' LIMIT 1");


// Accessing an individual candidate's scan, not the menu.
if(!empty($_REQUEST['sessionID']) && is_numeric($_REQUEST['sessionID'])) {
    // save changes if "save" was clicked
    $page = new MRIViewScansPage($_REQUEST['sessionID']);
    if ($user->hasPermission('mri_feedback') && isset($_POST['save_changes'])) {
        $page->_updateStatus($_POST);
        $page->_updateSelected($selectedTypeID);
        $page->_updateVisitStatus();
    } // done saving changes


        
    // find the current timepoint in the filtered list from State,
    // then assign next and prev
    // construct the link base

    // set the next and prev links urls    
    // The class is in MRIViewScansPage.class.inc page, since it's essentially
    // just a helper class for that page
    $NavBar = new MRINavigation($_REQUEST['sessionID']);
    $tpl_data['nextTimepoint']['URL'] = $NavBar->NextLink();
    $tpl_data['prevTimepoint']['URL'] = $NavBar->PrevLink();

 
    $tpl_data['body']=$page->display();
    $timer->setMarker('filling volume list template');
    $tpl_data['backURL'] = urldecode($_REQUEST['backURL']);
    $tpl_data['subject'] = $page->GetSubjectData();
    $tpl_data['files'] = $page->GetFileData($selectedTypeID);

    $tpl_data['showFloatJIV'] = True;

} else {
    // this happens in the main window. before you select a candidate and the corresponding volumes
    $page = new MRIMenuPage($_REQUEST['filter']);
    $tpl_data['body']=$page->display();
}

$smarty=new Smarty_neurodb;
// this is a fixme. Same data get's assigned to volume_list
$tpl_data['status_options'] = array (''=>'&nbsp;', 'Pass'=>'Pass', 'Fail'=>'Fail');
$tpl_data['pending_options'] = array ('Y'=>'Yes', 'N'=>'No');
$smarty->assign('subject', $subjectData);
$smarty->assign('files', $fileData);
if($user->hasPermission('mri_feedback')) $tpl_data['has_permission'] = true;
$smarty->assign($tpl_data);
$smarty->display('mri_browser_main.tpl');
$timer->setMarker('filling main template');

$timer->stop();
//$timer->display();
?>
