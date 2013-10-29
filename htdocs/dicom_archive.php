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

// create Database object
$DB = Database::singleton();
if(PEAR::isError($DB)) {
    print "Could not connect to database: ".$DB->getMessage()."<br>\n";
    die();
}
// check for valid user login

$user =& User::singleton();
if(PEAR::isError($user)) {
    die("Error creating user object: ".$user->getMessage());
}

$config =& NDB_Config::singleton();
$dicom_archive_settings = $config->getSetting('dicom_archive');
$tpl_data['study_title']=$config->getSetting('title');
$tpl_data['css']=$config->getSetting('css');
$tpl_data['user_full_name']=$user->getData('Real_name');
$tpl_data['user_site_name']=$user->getData('Site');

$tpl_data['TarchiveID'] = $_REQUEST['TarchiveID'];
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
// fixme: this is a hack to avoid mri_browser complaining on line 240
$some = array();
$_SESSION['State']->setProperty('mriSessionsListed' , $some);

/*******************************       Actual code starts here     ***********************************/ 

// this happens if you click on the Metadata link
if(!empty($_REQUEST['TarchiveID'])) {
    $query = "SELECT * FROM tarchive WHERE TarchiveID ='{$_REQUEST['TarchiveID']}'";
    $DB->selectRow($query, $detail_tpl_data['archive']);
    if(PEAR::isError($detail_tpl_data['archive'])) print $detail_tpl_data['archive']->getMessage()."<br>\n";

    // determine if the patient name is valid
    if(preg_match($dicom_archive_settings['patientNameRegex'], $detail_tpl_data['archive']['PatientName']))
       $detail_tpl_data['archive']['patientNameValid']=1;
    else {
       $detail_tpl_data['archive']['patientNameValid']=0;
       $detail_tpl_data['archive']['PatientName']="INVALID - HIDDEN";
    }
    
    // determine if the patient id is valid
    if(preg_match($dicom_archive_settings['patientIDRegex'], $detail_tpl_data['archive']['PatientID']))
       $detail_tpl_data['archive']['patientIDValid']=1;
    else {
       $detail_tpl_data['archive']['patientIDValid']=0;
       $detail_tpl_data['archive']['PatientID']="INVALID - HIDDEN";
    }

    
    $query = "SELECT * FROM tarchive_series WHERE TarchiveID = '{$_REQUEST['TarchiveID']}' ORDER BY TarchiveSeriesID";
    $DB->select($query, $detail_tpl_data['archive_series']);
    if(PEAR::isError($detail_tpl_data['archive_series'])) print $detail_tpl_data['archive_series']->getMessage()."<br>\n";

    $query = "SELECT * FROM tarchive_files WHERE TarchiveID ='{$_REQUEST['TarchiveID']}' ORDER BY TarchiveFileID";
    $DB->select($query, $detail_tpl_data['archive_files']);
    if(PEAR::isError($detail_tpl_data['archive_files'])) print $detail_tpl_data['archive_files']->getMessage()."<br>\n";

    // the State property Tarchive list is used to assign next and prev
    $filteredTarchiveList = $_SESSION['State']->getProperty('TarchivesListed');

    if (!is_array($filteredTarchiveList)) {$filteredTarchiveList = array(); }
    $currentListIndex = array_search($_REQUEST['TarchiveID'], $filteredTarchiveList);
    
    // construct the link base
    $linkBase = $_SERVER['REQUEST_URI'];
    $bits[0] = substr($linkBase, 0, strpos($linkBase, '?'));
    $bits[1] = substr($linkBase, strpos($linkBase, '?')+1);
    
    parse_str($bits[1], $urlParams);

    // set the next and prev links urls    
    if(isset($filteredTarchiveList[$currentListIndex+1])) {
        $urlParams['TarchiveID'] = $filteredTarchiveList[$currentListIndex+1];
        $bits[1] = Utility::unparse_str($urlParams);
        $tpl_data['nextTarchive']['URL'] = implode('?', $bits);
        
    }
    
    if(isset($filteredTarchiveList[$currentListIndex-1])) {
        $urlParams['TarchiveID'] = $filteredTarchiveList[$currentListIndex-1];
        $bits[1] = Utility::unparse_str($urlParams);
        $tpl_data['prevTarchive']['URL'] = implode('?', $bits);
    }

    # template for detailed archive metadata
    $smarty = new Smarty_neurodb;
    $smarty->assign('backURL', $_REQUEST['backURL']);
    $smarty->assign($detail_tpl_data);
    $tpl_data['body']=$smarty->fetch("dicom_archive_details.tpl");
    $tpl_data['backURL'] = urldecode($_REQUEST['backURL']);  
 
}
// default behavior 
// Fixme (or not?) You need to have an entry in MRI_alias for DCC in order to avoid a DCC member without view all data permission being able to accesss all data 
else {
    // Create picklist of available sites.
    $query = "SELECT CenterID, Name, MRI_alias 
              FROM psc WHERE MRI_Alias<>'' ".(!$user->hasPermission('access_all_profiles') ? 
              "AND CenterID=".$user->getCenterID() : '')." ORDER BY Name";
    $DB->select($query, $sites);
    // only create the all site selection filter for users with universal access permission
    if ($user->hasPermission('access_all_profiles')) { $visit_tpl_data['site_options']['']='All'; }
    foreach($sites AS $site) {
        $visit_tpl_data['site_options'][$site['CenterID']] = $site['MRI_alias'];
    }

    if($dicom_archive_settings['showTransferStatus'] == 'true')
       $visit_tpl_data['showTransferStatus'] = 1;
    else
       $visit_tpl_data['showTransferStatus'] = 0;


    // filtering options
    if(isset($_REQUEST['filter'])) {
        $filter = $_REQUEST['filter'];

        $oldFilter = $_SESSION['State']->getProperty('filter');
        if(is_array($oldFilter)) {
            $pending = $filter['pending'];
            $filter = array_merge($oldFilter, $filter);
        }
        $_SESSION['State']->setProperty('filter', $filter);
        $visit_tpl_data['filter'] = $filter;

        function AddWhere($filtername, $column) {
            global $filter;
            if(!empty($filter[$filtername])) {
                return " AND $column LIKE '" . $filter[$filtername] . "%'";
            }
            return;
        }
        $extra_where_string .= AddWhere('patientID', 'PatientID');
        $extra_where_string .= AddWhere('PatientName', 'PatientName');
        $extra_where_string .= AddWhere('PatientGender', "CASE PatientGender WHEN 'M' THEN PatientGender WHEN 'F' THEN PatientGender ELSE 'N/A' END" );
        $extra_where_string .= AddWhere('DoB', 'PatientDoB');
        $extra_where_string .= AddWhere('DateAcquired', 'DateAcquired');
        $extra_where_string .= AddWhere('ArchiveLocation', 'ArchiveLocation');
        if(!empty($filter['patientID'])) $extra_where_string .= " AND PatientID LIKE '%$filter[patientID]%'";
        if(!empty($filter['site'])) {
            $sitelimit = $filter['site'];
            $extra_where_string .= " AND neurodbCenterName = '{$visit_tpl_data['site_options'][$sitelimit]}'";
        }
        if($dicom_archive_settings['showTransferStatus'] == 'true') {
           $extra_transfer_system_fields = ", DateSent, PendingTransfer";
        }
        if(!empty($filter['orderby'])) {
            $extra_order=$filter['orderby'] . ',';
        }
        $query = "SELECT TarchiveID,DicomArchiveID,PatientID,PatientName,PatientGender,PatientDoB,DateAcquired,LastUpdate,SessionID,CenterName,neurodbCenterName,ArchiveLocation
                  $extra_transfer_system_fields
                  FROM tarchive
                  WHERE DicomArchiveID IS NOT NULL 
                  $extra_where_string ORDER BY $extra_order DateAcquired";

/*  This can be activated to do a retrospective linking of dicom archives to the MRI browser. 
    NOTE: this is useless if you are using tarchiveLoader
        $DB->select($query, $visit_tpl_data['archives']);       
        if(PEAR::isError($visit_tpl_data['archives'])) print $visit_tpl_data['archives']->getMessage()."<br>\n";

        // link with session
        foreach ($visit_tpl_data['archives'] as $key => $archive) {
            // only do this if no valid session has been assigned. Typically this should have been done by the tarchiveLoader
           if (0) { //$archive['SessionID'] < 1) {
                $querySID = "SELECT Distinct f.SessionID FROM parameter_file as p right join files as f on p.FileID = f.FileID 
                             WHERE Value='{$archive['DicomArchiveID']}' LIMIT 1";
                $SessionID = $DB->selectOne($querySID);
                $queryUP =   "UPDATE tarchive SET SessionID='$SessionID' WHERE DicomArchiveID='{$archive['DicomArchiveID']}'";
                $DB->run($queryUP);
            }
        }
*/

        $DB->select($query, $visit_tpl_data['archives']);
        if(PEAR::isError($visit_tpl_data['archives'])) print $visit_tpl_data['archives']->getMessage()."<br>\n";
        $visit_tpl_data['numArchives'] = count($visit_tpl_data['archives']);

        // per-record code
        for($i=0; $i<count($visit_tpl_data['archives']); $i++) {
            
            // push on Tarchive ID on a list for Prev and Next
            $filtered_TarchiveIDs[] = $visit_tpl_data['archives'][$i]['TarchiveID'];

            // determine if the transfer system is in use
            if($dicom_archive_settings['showTransferStatus'] == 'true') {
                if($visit_tpl_data['archives'][$i]['PendingTransfer']) {
                    $visit_tpl_data['archives'][$i]['TransferStatus'] = "Queued";
                    $visit_tpl_data['archives'][$i]['transferStatusClass'] = "tarchivePendingTransfer";
                } elseif(!is_null($visit_tpl_data['archives'][$i]['DateSent'])) {
                    $visit_tpl_data['archives'][$i]['TransferStatus'] = "Sent ".$visit_tpl_data['archives'][$i]['DateSent'];
                    $visit_tpl_data['archives'][$i]['transferStatusClass'] = "tarchiveTransferred";
                } else {
                    $visit_tpl_data['archives'][$i]['TransferStatus'] = "Not Transferred";
                    $visit_tpl_data['archives'][$i]['transferStatusClass'] = "tarchiveNotTransferred";
                }
            } else {
                $visit_tpl_data['archives'][$i]['TransferStatus'] = $visit_tpl_data['archives'][$i]['PendingTransfer'] . " " . $visit_tpl_data['archives'][$i]['DateSent'];
            }

            // determine if the patient name is valid
            if(preg_match($dicom_archive_settings['patientNameRegex'], $visit_tpl_data['archives'][$i]['PatientName']))
                $visit_tpl_data['archives'][$i]['patientNameValid']=1;
            else {
                $visit_tpl_data['archives'][$i]['patientNameValid']=0;
                $visit_tpl_data['archives'][$i]['PatientName']="INVALID - HIDDEN";
            }

            if($visit_tpl_data['archives'][$i]['patientNameValid'] == 1 && !empty($visit_tpl_data['archives'][$i]['PatientName'])) {
                $PatientName = $visit_tpl_data['archives'][$i]['PatientName'];
                $sp = explode("_", $PatientName);
                $DB->selectRow("SELECT ID FROM session WHERE CandID=$sp[1] AND Visit_label='$sp[2]'", &$SessionID);
                $visit_tpl_data['archives'][$i]['PSCID'] = $sp[0];
                $visit_tpl_data['archives'][$i]['DCCID'] = $sp[1];
                $visit_tpl_data['archives'][$i]['Visit_Label'] = $sp[2];
                if(!empty($sessionID['ID'])) {
                    $visit_tpl_data['archives'][$i]['SessionID'] = $SessionID['ID'];
                }
            }
            // determine if the patient id is valid
            if(preg_match($dicom_archive_settings['patientIDRegex'], $visit_tpl_data['archives'][$i]['PatientID']))
                $visit_tpl_data['archives'][$i]['patientIDValid']=1;
            else {
                $visit_tpl_data['archives'][$i]['patientIDValid']=0;
                $visit_tpl_data['archives'][$i]['PatientID']="INVALID - HIDDEN";
            }
            
        }
    }

    // the list of filtered tarchives is produced above while checking for valid IDs etc...
    $_SESSION['State']->setProperty('TarchivesListed', $filtered_TarchiveIDs);

    // filter template
    $smarty = new Smarty_neurodb;
    $smarty->assign('backURL', $_SERVER['REQUEST_URI']);
    $smarty->assign('filter', $filter);
    $smarty->assign($visit_tpl_data);
    $tpl_data['body']=$smarty->fetch("dicom_archive_list.tpl");
}
// main template
$smarty=new Smarty_neurodb;
$smarty->assign($tpl_data);
$smarty->display('dicom_archive_main.tpl');
$timer->setMarker('filling main template');

$timer->stop();
// $timer->display();
?>
