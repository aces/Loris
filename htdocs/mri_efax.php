<?
/**
* This script manages efax files, updates DB, and displays the GUI forms to work with efax files.
*
* efax files are received by e-efax and converted to .jpg files using
* cmd-line tools.  these jpg files are copied in to the efaxes/ dir
* and referenced in the mri_efax_parameter_form table irrelevant efaxes
* are deleted and the reference to this event is recorded in the
* mri_deleted_efax_pages table.
*
* @version $Id: mri_efax.php,v 3.16 2007/03/02 16:39:07 sebas Exp $
* @package efax
*/
ob_start('ob_gzhandler');

require_once "NDB_Client.class.inc";
$client = new NDB_Client();
$client->initialize();

require_once "Site.class.inc";
require_once "Candidate.class.inc";
require_once "TimePoint.class.inc";
// client specific requires
require_once "NDB_MRI_Efax.class.inc";

// make a local config object
$config =& NDB_Config::singleton();
$paths = $config->getSetting('paths');
$study = $config->getSetting('study');
$mriPaths = $config->getSetting('mri');
$tpl_data['css']=$config->getSetting('css');

// user is logged in, let's continue with the show...

// save selection form data
if (is_array($_REQUEST['filter']) && sizeof($_REQUEST['filter']) > 0) {
    if ($_REQUEST['filter']['RESET']) {
        // erase filter data from the sesion
        $_SESSION['State']->setProperty('filter', NULL);
    } else {
        // get existing filter array
        $filter = $_SESSION['State']->getProperty('filter');
        
        // unset unneeded tags
        if (isset($_REQUEST['filter']['SELECT'])) unset($_REQUEST['filter']['SELECT']);
        
        // merge with newly passed args
        $filter = array_merge($filter, $_REQUEST['filter']);
        
        // set new property
        $_SESSION['State']->setProperty('filter', $filter);
        
        //unset vars
        unset($filter);
    }
}

/**
* Objects and privileges
*/
// create user object
$user =& User::singleton();
if(PEAR::isError($user)) {
    $tpl_data['error_message'][] = "User Error: " . $user->getMessage();
}
$tpl_data['userID'] = $user->getData('UserID');

$userSite =& Site::singleton($user->getData('CenterID'));
if(PEAR::isError($userSite)) {
    $tpl_data['error_message'][] = "User Site Error: " . $userSite->getMessage();
}

// check permissions
if ($user->hasPermission('mri_efax')) {
    // update the record in mri_efax_parameter_form (cannot update File_name, Page)
    // unassign the files and remove the record from mri_efax_parameter_form
    // delete the files from the system & insert records into mri_efax_deleted_pages
    // move the file from unassigned_dir into new_dir
    // assign new files and insert record into mri_efax_parameter_form
    $tpl_data['has_permission'] = true;

} else {
    // do not grant access to non-site users w/ access to profiles perms
    if (!$userSite->isStudySite() && !$user->hasPermission('access_all_profiles')) {
        $tpl_data['error_message'][] = "You don't have access to this client. Please close the window and return to the main Database interface.";
    }
}

// get the list of sites for users w/ access to all sites and w/ perm to edit mri efax files
if ($user->hasPermission('access_all_profiles') || $user->hasPermission('mri_efax')) {
    
    // get the list of study sites - to be replaced by the Site object
    $list_of_sites =& Utility::getSiteList();
    
    // capture the error and throw the PEAR:Error object
    if(!PEAR::isError($list_of_sites) && is_array($list_of_sites)) {
        //get the list of CenterIDs
        $tpl_data['psc_value_array'] = array_merge(array(''), array_keys($list_of_sites));
        //get the list of site Names
        $tpl_data['psc_label_array'] = array_merge (array('&nbsp;'), array_values($list_of_sites));
    }
    unset($list_of_sites);
    
} else {
    // if not multisite user, then allow only to view own site data
    $tpl_data['psc_value_array'] = array($user->getCenterID());
    $tpl_data['psc_label_array'] = array($user->getSiteName());

    // force the filter to show only own site's data
    // get existing filter array
    $filter = $_SESSION['State']->getProperty('filter');
    // merge with newly passed args
    $filter = array_merge($filter, array("candidate.CenterID"=>$user->getCenterID()));
    // set new property
    $_SESSION['State']->setProperty('filter', $filter);
    //unset vars
    unset($filter);
}

// get the list of scan categories
$tpl_data['scan_category_value_array'] = array(null, 'subject', 'ACRQC', 'living_phantom', 'mritest');
$tpl_data['scan_category_label_array'] = array('', 'subject', 'ACRQC', 'living_phantom', 'mritest');


/**
* create MRIEfax object
*/
$mriEfax =& new NDB_MRI_Efax($mriPaths);
if(PEAR::isError($mriEfax)) {
    $tpl_data['error_message'][] = "Efax Error: " . $mriEfax->getMessage();
}


/*
* Main switch
*/
switch ($_REQUEST['mri_efax_screen']) {
    
    /**
    * assigning new efax files
    */
    case 'new':
    
    // if the user does not have a privilege, show message
    if (!$user->hasPermission('mri_efax')) {
        $tpl_data['error_message'][] = "You are not authorized to access this feature. Please select another option from the menu";
        break;
    }
    
    /**
    * process the form data
    */
    if (!empty($_REQUEST['Efax_action'])) {
        
        
        // process the data
        switch ($_REQUEST['Efax_action']) {
            
            case "Assign Files":
            
            if (empty($_REQUEST['centerID'])  || empty($_REQUEST['scanType']) || empty($_REQUEST['candID']) || empty($_REQUEST['sessionID']) || empty($_REQUEST['studyDate'])) {
                // set the warning message
                $tpl_data['message'][] = "Warning: All selection filter fields must be set!";
                break;
            }
            
            if (!is_array($_REQUEST['newEfaxList'])  || count($_REQUEST['newEfaxList']) == 0) {
                // set the warning message
                $tpl_data['message'][] = "Warning: You must select at least one file!";
                break;
            }
            
            foreach ($_REQUEST['newEfaxList'] as $fileName=>$page) {
                
                $success = $mriEfax->assignEfaxPage($_REQUEST['centerID'],$_REQUEST['candID'], $_REQUEST['sessionID'], $_REQUEST['scanType'], $fileName, $page, $_REQUEST['studyDate'], $user->getUsername(), $_REQUEST['comment']);
                
                if (PEAR::isError($success)) {
                    $tpl_data['message'][] = "Error, failed to assign file ($fileName) page ($page) to candidate (".$_REQUEST['candID']."), timepoint (".$_REQUEST['sessionID']."): \n".$success->getMessage();
                    break;
                }
                
                // remove the element from the array if successfully assigned
                unset($_REQUEST['newEfaxList'][$fileName]);
            }
            // remove date of acq and comnent to prevent incidental assignment of other files
            unset($_REQUEST['comment']);
            unset($_REQUEST['studyDate']);

            break;
            
            
            case 'Delete Files':
            
            if (!is_array($_REQUEST['newEfaxList'])  || count($_REQUEST['newEfaxList']) == 0) {
                // set the warning message
                $tpl_data['message'][] = "Warning: You must select at least one file!";
                break;
            }
            
            foreach ($_REQUEST['newEfaxList'] as $fileName=>$page) {
                $success = $mriEfax->deleteEfaxPage($fileName, $_REQUEST['mri_efax_screen']);
                // in case of error, stop processing
                if (PEAR::isError($success)) {
                    $tpl_data['message'][] = "Error, failed to delete file ($fileName) from path ('".$_REQUEST['mri_efax_screen']."_dir'):\n".$success->getMessage();
                    break;
                }
                
                // remove successfully processed elements from the array
                unset($_REQUEST['newEfaxList'][$fileName]);
            }
            
            break;
        } // end switch
    }
    
    /*
    * Prepare/process the selection filter form data
    *
    * this long block of code processes the selection filter form value and build next select box to the right
    * finally once all boxes have selected options, the assign button will appear
    * the next block of code deals with the list of files to be assigned/deleted
    */
    if (!empty($_REQUEST['centerID'])) {
        
        // create site object
        $site =& Site::singleton($_REQUEST['centerID']);
        
        if (PEAR::isError($site)) {
            $tpl_data['error_message'][] = "Error, failed to create site object:\n" . $site->getMessage();
            
        } else {
            
            // hardcoded for now...
            $tpl_data['scan_type_value_array'] = array('', 'subject','ACRQC','living_phantom','mritest');
            $tpl_data['scan_type_label_array'] = array('', 'subject','ACR phantom','living_phantom','mritest');
            
            // if the scan type is selected
            if (!empty($_REQUEST['scanType'])) {
                
                // get the list of candidates for the form
                if ($_REQUEST['scanType'] == 'subject') {
                    $query = "SELECT CandID, CONCAT(CandID,'/',PSCID) AS Label FROM candidate as c WHERE Active = 'Y' AND Cancelled = 'N' AND CenterID = '".$_REQUEST['centerID']."' AND Entity_type = 'Human' ORDER BY CandID";
                } else {
                    $query = "SELECT c.CandID, CONCAT('Scanner(',c.CandID,'): ',m.Model,'-',m.Software) AS Label FROM candidate as c, mri_scanner as m, session as s WHERE c.CandID=s.CandID AND c.CandID=m.CandID AND c.Active = 'Y' AND c.Cancelled = 'N' AND c.Entity_type = 'Scanner' AND s.CenterID = '".$_REQUEST['centerID']."' GROUP BY c.CandID ORDER BY c.CandID";
                }
                    
                    
                
                $DB->select($query, $result);
                if (PEAR::isError($result)) {
                    
                    $tpl_data['error_message'][] = "Error, failed to select candidates for the site (".$_REQUEST['centerID']."):\n" . $result->getMessage();
                    
                } else {
                    
                    // prepare the tpl array
                    $tpl_data['candID_value_array'][] = '';
                    $tpl_data['candID_label_array'][] = '';
                    foreach ($result as $candidate) {
                        $tpl_data['candID_value_array'][] = $candidate["CandID"];
                        $tpl_data['candID_label_array'][] = $candidate["Label"];
                    }
                    unset($candidate);
                    
                    // if the candiddate is selected, show the list of timepoints
                    if (!empty($_REQUEST['candID']) && in_array($_REQUEST['candID'], $tpl_data['candID_value_array'])) {
                        
                        unset ($result);
                        
                        // create candidate object
                        $candidate =& Candidate::singleton($_REQUEST['candID']);
                        
                        if (PEAR::isError($candidate)) {
                            
                            $tpl_data['error_message'][] = "Error, failed to create candidate object:\n" . $candidate->getMessage();
                            
                        } else {
                                                    
                            // get the list of timepoints
                            $listOfTimePoints = $candidate->getListOfTimePoints();
                            if (PEAR::isError($listOfTimePoints)) {
                                $tpl_data['error_message'][] = "Error, failed to get the list of timepoints:\n" . $listOfTimePoints->getMessage();
                            
                            } else {

                                $listOfVisits = $candidate->getListOfVisitLabels();
                                if (PEAR::isError($listOfVisits)) {
                                    $tpl_data['error_message'][] = "Error, failed to get the list of timepoints:\n" . $listOfVisits->getMessage();
                                } else {
                                    
                                    // prepare tpl array
                                    $tpl_data['sessionID_value_array'][] = '';
                                    $tpl_data['sessionID_label_array'][] = '';
                                    foreach ($listOfVisits as $currSessionID=>$currVisitLabel) {
                                        $tpl_data['sessionID_label_array'][] = $currVisitLabel;
                                        $tpl_data['sessionID_value_array'][] = $currSessionID;
                                    }
                                    unset($currSessionID);
                                    unset($currVisitLabel);
                                    unset($listOfVisits);

                                    // create the timepoint object
                                    if (!empty($_REQUEST['sessionID']) && in_array($_REQUEST['sessionID'], $tpl_data['sessionID_value_array'])) {

                                        // create timepoint object
                                        $timePoint =& TimePoint::singleton($_REQUEST['sessionID']);

                                        if (PEAR::isError($timePoint)) {

                                            $tpl_data['error_message'][] = "Error, failed to create timepoint object:\n" . $timePoint->getMessage();

                                        } else {

                                            // get the dates of MRI scans for the timepoint
                                            $query = "SELECT DATE_FORMAT(t.Value, '%Y-%m-%d') as Study_date
                                                  FROM session as s, files as f, parameter_file as t 
                                                  WHERE f.FileID = t.FileID AND t.ParameterTypeID=27 AND s.ID = f.SessionID AND s.Active = 'Y' 
                                                        AND s.Cancelled = 'N' AND t.Value <> '0000-00-00' AND s.ID = '".$_REQUEST['sessionID']."' GROUP BY Study_date";
                                            $DB->select($query, $result);
                                            if (PEAR::isError($result)) {
                                                $tpl_data['error_message'][] = "Error, failed to select date of MRI studies for the timepoint (".$_REQUEST['sessionID']."):\n" . $timePoint->getMessage();

                                            } else {

                                                // prepare the tpl array
                                                $tpl_data['studyDate_value_array'][] = '';
                                                $tpl_data['studyDate_label_array'][] = '';
                                                foreach ($result as $currStudyDate) {
                                                    $tpl_data['studyDate_value_array'][] = $currStudyDate["Study_date"];
                                                    $tpl_data['studyDate_label_array'][] = date('Y-m-d', strtotime($currStudyDate["Study_date"]));
                                                }

                                                // if all variables are properly set, show the assign button
                                                if (!empty($_REQUEST['studyDate']) && in_array($_REQUEST['sessionID'], $listOfTimePoints) && count($result)>0) {
                                                    $tpl_data['showAssignButton'] = 1;
                                                }

                                                // unset vars
                                                unset ($result);
                                                unset($currStudyDate);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    
    /**
    * pass the selected values back to the form
    */
    $tpl_data['centerID'] = $_REQUEST['centerID'];
    $tpl_data['scanType'] = $_REQUEST['scanType'];
    $tpl_data['candID'] = $_REQUEST['candID'];
    $tpl_data['sessionID'] = $_REQUEST['sessionID'];
    $tpl_data['studyDate'] = $_REQUEST['studyDate'];
    $tpl_data['comment'] = $_REQUEST['comment'];

    /**
    * this section (to the end of the case part) deals with the list of files to be assigned or deleted
    */
    //get the list of new efaxes
    $efax_list = $mriEfax->listFiles($_REQUEST['mri_efax_screen']);
    if (PEAR::isError($efax_list)) {
        $tpl_data['error_message'][] = "Failed to get the list of newly arrived files" . $efax_list->getMessage();
        break;
    }
    
    // if no files were returned, stop processing
    if (!is_array($efax_list) || count($efax_list) == 0) break;
    
    // configure the page paginzation
    require_once 'Pager/Pager.php';
    $params = array(
    'mode'       => 'Sliding',
    'perPage'    => 50,
    'delta'      => 3,
    'itemData'   => $efax_list,
    );
    $pager = & new Pager($params);
    $efax_list = $pager->getPageData();
    $links = $pager->getLinks();
    $tpl_data['page_links']=$links[all];
    
    // get the keys of the efaxList array, keys are the file names
    if (is_array($_REQUEST['newEfaxList'])) { $keys = array_keys($_REQUEST['newEfaxList']); }
    // create an array of new efaxes for the smarty template
    $i = 0;
    foreach ($efax_list as $current_efax_file) {
        // file name
        $tpl_data['efax_list'][$i]['File_name'] = $current_efax_file;
        $absoluteFileName = $mriEfax->getJpgFile($current_efax_file, $_REQUEST['mri_efax_screen']);
        
        if (PEAR::isError($absoluteFileName)) {
            $tpl_data['error_message'][] = "Error w/ file -> " . $absoluteFileName->getMessage();
            break;
        } else {
            $tpl_data['efax_list'][$i]['absoluteFileName'] = $absoluteFileName;
        }
        
        // extract page number from $current_efax_page
        if(substr($current_efax_file,strpos($current_efax_file, '.')+1,1) != "j") {
            $tpl_data['efax_list'][$i]['Page'] = substr(basename($current_efax_file,".jpg"),strpos(basename($current_efax_file,".jpg"),'.')+1);
        } else {
            $tpl_data['efax_list'][$i]['Page'] = 'n/a';
        }
        // mark the checkbox as selected
        if (is_array($keys)) {
            // if the file name is in the keys array, check the checkbox
            if (in_array($current_efax_file, $keys)) {
                $tpl_data['efax_list'][$i]['Checked'] = 'checked';
            }
        }
        $i++;
    }
    unset($efax_list);
    unset($keys);
    
    break; // end case:new
    
    
    
    
    
    /**
    * Displays the unassigned efax pages
    */
    case 'unassigned':
    
    if (!$user->hasPermission('mri_efax')) {
        $tpl_data['error_message'][] = "You are not authorized to access this feature. Please select another option from the menu";
        break;
    }
    
    /**
    * process the form data
    */
    if (!empty($_REQUEST['Efax_action'])) {
        
        // check the form fields
        if (!is_array($_REQUEST['unassignedEfaxList'])  || count($_REQUEST['unassignedEfaxList']) == 0) {
            
            // set the warning message
            $tpl_data['message'][] = "Warning: You must select at least one file!";
            
        } else {
            
            // process the data
            switch ($_REQUEST['Efax_action']) {
                
                case 'Delete Files':
                
                foreach ($_REQUEST['unassignedEfaxList'] as $fileName=>$page) {
                    $success = $mriEfax->deleteEfaxPage($fileName, $_REQUEST['mri_efax_screen']);
                    // in case of error, stop processing
                    if (PEAR::isError($success)) {
                        $tpl_data['message'][] = "Error, failed to delete file ($fileName) from path ('".$_REQUEST['mri_efax_screen']."_dir'):\n".$success->getMessage();
                        break;
                    }
                    
                    // remove successfully processed elements from the array
                    unset($_REQUEST['unassignedEfaxList'][$fileName]);
                }
                break;
                
                case 'Restore Files':
                
                foreach ($_REQUEST['unassignedEfaxList'] as $fileName=>$page) {
                    $success = $mriEfax->restoreEfaxPage($fileName);
                    // in case of error, stop processing
                    if (PEAR::isError($success)) {
                        $tpl_data['message'][] = "Error, failed to restore file ($fileName):\n".$success->getMessage();
                        break;
                    }
                    
                    // remove successfully processed elements from the array
                    unset($_REQUEST['unassignedEfaxList'][$fileName]);
                }
                break;
            } // end switch
        }
    }
    
    //get the list of unassigned efaxes
    $efax_list = $mriEfax->listFiles($_REQUEST['mri_efax_screen']);
    if (PEAR::isError($efax_list)) {
        $tpl_data['error_message'][] = "Failed to get the list of newly arrived files" . $efax_list->getMessage();
        break;
    }
    
    // if no files were returned, exit the switch
    if (!is_array($efax_list) || count($efax_list) == 0) break;
    
    // configure the page paginzation
    require_once 'Pager/Pager.php';
    $params = array(
    'mode'       => 'Sliding',
    'perPage'    => 50,
    'delta'      => 3,
    'itemData'   => $efax_list,
    );
    $pager = & new Pager($params);
    $efax_list = $pager->getPageData();
    $links = $pager->getLinks();
    $tpl_data['page_links']=$links[all];
    
    // if there are files, create an array of new efaxes for the smarty template
    // get the keys of the efaxList array, keys are the file names
    if (is_array($_REQUEST['unassignedEfaxList'])) { $keys = array_keys($_REQUEST['unassignedEfaxList']); }
    $i = 0;
    foreach ($efax_list as $current_efax_file) {
        
        // get the jpg file link
        $absoluteFileName = $mriEfax->getJpgFile($current_efax_file, $_REQUEST['mri_efax_screen']);
        
        // if error, stop page display and show an error to deal w/ the problem
        if (PEAR::isError($absoluteFileName)) {
            $tpl_data['error_message'][] = "Error w/ file -> " . $absoluteFileName->getMessage();
            break;
        }
        
        // prepare the tpl array
        // jpg link
        $tpl_data['efax_list'][$i]['absoluteFileName'] = $absoluteFileName;
        // set file name
        $tpl_data['efax_list'][$i]['File_name'] = $current_efax_file;
        // extract page number from $current_efax_page
        if(substr($current_efax_file,strpos($current_efax_file, '.')+1,1) != "j") {
            $tpl_data['efax_list'][$i]['Page'] = substr(basename($current_efax_file,".jpg"),strpos(basename($current_efax_file,".jpg"),'.')+1);
        } else {
            $tpl_data['efax_list'][$i]['Page'] = 'n/a';
        }
        // mark the checkbox as selected
        if (is_array($keys)) {
            // if the file name is in the keys array, check the checkbox
            if (in_array($current_efax_file, $keys)) {
                $tpl_data['efax_list'][$i]['Checked'] = 'checked';
            }
        }
        $i++;
    }
    unset($efax_list);
    unset($keys);
    
    break; // end case:unassigned
    
    
    /**
    * Display Assigned Efaxes
    */
    case 'assigned':
    default:
    
    /**
    * Lock/Unlock timepoints
    */
    if (!empty($_REQUEST['setTimepointLock'])) {
    	$success = $mriEfax->setTimepointLock($_REQUEST['timepointLockSessionID']);
    	unset($_REQUEST['setTimepointLock']);
    }
    
    /** 
    * process the form data
    */
    if (!empty($_REQUEST['Efax_action'])) {
        
        // check the form fields
        if (!is_array($_REQUEST['assignedEfaxList'])  || count($_REQUEST['assignedEfaxList']) == 0) {
            
            // set the warning message
            $tpl_data['message'][] = "Warning: You must select at least one file!";
            
        } else {
            
            // process the data
            switch ($_REQUEST['Efax_action']) {
                
                case 'Unassign Files':
                
                foreach ($_REQUEST['assignedEfaxList'] as $fileName=>$page) {
                    
                $success = $mriEfax->unassignEfaxPage($fileName);
                    // in case of error, stop processing
                    if (PEAR::isError($success)) {
                        $tpl_data['message'][] = "Error, failed to unassign file ($fileName):\n".$success->getMessage();
                        break;
                    }
                    
                    // remove successfully processed elements from the array
                    unset($_REQUEST['assignedEfaxList'][$fileName]);
                }
                break;
                
                
                // will add the code to update assigned records later...
                case 'Update File':
                break;
                
            } // end switch
        }
    }
    
    
    /**
    * start working on the form display
    */
    $filter = $_SESSION["State"]->getProperty("filter");

    // get the list of assigned efaxes
    $efax_list = $mriEfax->getListOfEfaxPages($filter['candidate.CenterID'], $filter['mri_efax_parameter_form.Scan_category'], $filter['candidate.CandID']);
    
    // display the error and stop processing
    if (PEAR::isError($efax_list)) {
        $tpl_data['error_message'][] = "Failed to get the list of assigned efax pages " . $efax_list->getMessage();
        break;
    }
    
    // when there are no assigned files
    if (is_array($efax_list) && count($efax_list) > 0) {
        
        // configure the page paginzation
        require_once 'Pager/Pager.php';
        $params = array(
        'mode'       => 'Sliding',
        'perPage'    => 50,
        'delta'      => 3,
        'itemData'   => $efax_list,
        );
        $pager = & new Pager($params);
        $efax_list = $pager->getPageData();
        $links = $pager->getLinks();
        $tpl_data['page_links']=$links[all];
        
        // loop the list of assigned efaxes
        // get the keys of the efaxList array, keys are the file names
        if (is_array($_REQUEST['assignedEfaxList'])) { $keys = array_keys($_REQUEST['assignedEfaxList']); }
        $i=0;
        foreach ($efax_list as $current_efax_file) {
            
            // for this client, files are store in subdirs named by CandID
            if ($current_efax_file['Scan_category']!='subject') {
                $fileName = $current_efax_file['Scan_category'] . '/' . $current_efax_file['MRI_alias'] .'/' . $current_efax_file['File_name'];
            } else {
                $fileName = $current_efax_file['CandID'] . '/' . $current_efax_file['File_name'];
            }
            
            // contruct the full path to file
            $absoluteFileName = $mriEfax->getJpgFile($fileName, 'assigned');
            
            // show the records w/o link if there is a problem with the file
            if (!PEAR::isError($absoluteFileName)) {
                $tpl_data['efax_list'][$i]['absoluteFileName'] = $absoluteFileName;
            }
            
            $tpl_data['efax_list'][$i]['Site'] = $current_efax_file['Site'];
            $tpl_data['efax_list'][$i]['Scan_category'] = $current_efax_file['Scan_category'];
            $tpl_data['efax_list'][$i]['CandID'] = $current_efax_file['CandID'];
            $tpl_data['efax_list'][$i]['PSCID'] = $current_efax_file['PSCID'];
            $tpl_data['efax_list'][$i]['VisitNo'] = $current_efax_file['VisitNo'];
            $tpl_data['efax_list'][$i]['Visit_label'] = $current_efax_file['Visit_label'];
            $tpl_data['efax_list'][$i]['Page'] = $current_efax_file['Page'];
            $tpl_data['efax_list'][$i]['File_name'] = $current_efax_file['File_name'];
            $tpl_data['efax_list'][$i]['Date'] = $current_efax_file['Date'];
            $tpl_data['efax_list'][$i]['Testdate'] = $current_efax_file['Testdate'];
            $tpl_data['efax_list'][$i]['ID'] = $current_efax_file['ID'];
            $tpl_data['efax_list'][$i]['SessionID'] = $current_efax_file['SessionID'];
            $tpl_data['efax_list'][$i]['Comment'] = $current_efax_file['Comment'];
            $tpl_data['efax_list'][$i]['TimepointLock'] = $current_efax_file['TimepointLock'];
            // mark the checkbox as selected
            if (is_array($keys)) {
                // if the file name is in the keys array, check the checkbox
                if (in_array($current_efax_file['File_name'], $keys)) {
                    $tpl_data['efax_list'][$i]['Checked'] = 'checked';
                }
            }
            $i++;
        }
        unset($efax_list);
        unset($keys);
    }
    
    // get other items
    $tpl_data['candidate_CenterID'] = $filter['candidate.CenterID'];
    $tpl_data['candidate_CandID'] = $filter['candidate.CandID'];
    $tpl_data['scanCategory'] = $filter['mri_efax_parameter_form.Scan_category'];
    
    // unset vars
    unset($filter);
}



/**
* HTML Stuff
*
* set page titles
*/
$tpl_data['study_title'] = $study['title'] . ' - MRI Efax Client';
$tpl_data['mri_efax_screen'] = $_REQUEST['mri_efax_screen'];
if (!empty($_REQUEST['pageID'])) $tpl_data['pageID'] = $_REQUEST['pageID'];

//Output template using Smarty
$smarty=new Smarty_neurodb;
if (is_array($tpl_data)) $smarty->assign($tpl_data);
$smarty->display('mri_efax.tpl');

ob_end_flush();
die();
?>