<?php

/**
 * form_imaging_browser class file
 *
 * PHP version 5
 * 
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging 
 * @author     Loris team <info-loris.mni@mcgill.ca> 
 * @license    @GPLv3
 * @link       https://github.com/aces/Loris-Trunk
*/

require_once __DIR__ . '/Imaging_Session_ControlPanel.class.inc';
/**
 * NDB_Form_Imaging_Browser Class
 *
 * This class is imaging_browser Form
 * 
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging 
 * @author     Loris team <info-loris.mni@mcgill.ca>
 * @license    @GPLv3
 * @link       https://github.com/aces/Loris-Trunk
*/

class NDB_Form_Imaging_Browser extends NDB_Form
{
    /**
     * var to store the scanner information. 
     * Will be used from the last file.
     */
    var $scanner;
    /**
     * var to store the sessionID.
     */
    var $sessionID;

    /**
     * Determine whether the user has permission to view the imaging_browser page
     *
     * @return bool whether the user has access
     */
    function _hasAccess()
    {
        $user =& User::singleton();

        // allow only to view own site data
        $timePoint =& TimePoint::singleton($_REQUEST['sessionID']);

        return ($user->hasPermission('imaging_browser_view_allsites') || ($user->getData('CenterID') == $timePoint->getData('CenterID') && $user->hasPermission('imaging_browser_view_site')));
    }

    /**
     * Determine whether the user has permission to QC the imaging_browser page
     *
     * @return bool whether the user has QC permission
     */
    function _hasQCPerm()
    {
        $user =& User::singleton();

        return $user->hasPermission('imaging_browser_qc');
    }

    /**
     * Sets up main parameters 
     *
     * @return NULL
     */
    function viewSession() 
    {
        $this->DB = Database::singleton();

        $this->sessionID = $_REQUEST['sessionID'];

        if (!empty($this->sessionID) && is_numeric($this->sessionID)) {
            if ($this->_hasAccess() && isset($_POST['save_changes'])) {
                $this->_updateStatus($_POST);
                $this->_updateSelected();
                $this->_updateVisitStatus();
            }
            $this->_setFilesData();

            $this->tpl_data['headerTable'] = $this->getHeaderTable();

            $this->tpl_data['showFloatJIV'] = true;

            $file = $this->DB->pselectOne(
                "SELECT File FROM files f 
                JOIN session s 
                ON (s.ID=f.SessionID) 
                WHERE s.ID=:sid AND FileType='obj'", 
                array('sid' =>$this->sessionID)
            );
            if (!empty($file)) {
                $this->tpl_data['show3DViewer'] = true;
            }

            $types_q = $this->DB->pselect(
                "SELECT mri_scan_type.Scan_type FROM mri_scan_type", array()
            );
            $types[''] = '';
            foreach ($types_q as $row) {
                $type = $row['Scan_type'];
                $types[$type] = $type;
            }
            $this->tpl_data['selected_options'] = $types;

            $this->tpl_data['status_options'] 
                = array (''=>'&nbsp;', 'Pass'=>'Pass', 'Fail'=>'Fail');
            $this->tpl_data['caveat_options'] 
                = array ('' => '&nbsp;', true => 'True', false => 'False');
            $this->tpl_data['has_permission'] = ($this->_hasAccess()) ? true : false;
            $this->tpl_data['has_qc_permission'] = ($this->_hasQCPerm()) ? true : false;
            if ($this->_hasQCPerm()) {
                $this->FormAction = "/imaging_browser/viewSession/?sessionID=" . $this->sessionID;
            }

        }
    }
    /**
    * Sets files values
    *
    * @return NULL
    */
    function _setFilesData() 
    {
        $extra_where_string = "";
        if (!empty($_REQUEST['selectedOnly'])) {
            $extra_where_string .= " AND COALESCE(sel.Selected,'') <> ''";
        }
        // To better support QC for CIVET output a couple of 
        // additional conditions have been put in...
        if (!empty($_REQUEST['outputType'])) {
            $outputType = urldecode($_REQUEST['outputType']);
            if ($outputType=="processed") { 
                $extra_where_string .= " AND OutputType != 'native' "; 
            } elseif ($outputType=="native") { 
                $extra_where_string .= " AND OutputType='$outputType'"; 
            } elseif ($outputType=="skull_mask") { 
                $extra_where_string .= " AND (OutputType='$outputType' 
                    OR  (OutputType='native' AND AcquisitionProtocolID='44') )"; 
            } else {
                $extra_where_string .= " AND (OutputType='$outputType' 
                    OR OutputType='linreg')";
            }
        }
        $files = $this->DB->pselect(
            "SELECT files.FileID FROM files LEFT JOIN files_qcstatus as sel on (
            files.FileID=sel.FileID) 
            WHERE SessionID=:SID AND (AcquisitionProtocolID IS NULL 
            OR AcquisitionProtocolID not in (1, 2, 3, 52)) 
            AND PendingStaging=0 $extra_where_string 
            ORDER BY files.OutputType, files.File",
            array(
               'SID' => $this->sessionID,
           )
        );
        $this->tpl_data['files'] = array();
        foreach ($files as $fileRow) {
            $FileObj = new MRIFile($fileRow['FileID']);
            if (empty($scannerID)) {
                $scannerID = $FileObj->getParameter('ScannerID');
                if (!empty($scannerID)) {
                    $query = "SELECT 
                        CONCAT_WS(' ', Manufacturer, Model, Serial_number) 
		        FROM mri_scanner WHERE ID=:ScanID";
                    $this->scanner = $this->DB->pselectOne(
                        $query, array('ScanID' => $scannerID)
                    );
                }
            }
            $file = array(
                'FileID'   => $fileRow['FileID'],
                'Filename' => basename($FileObj->getParameter('File')),
                'CheckPic' => "/mri/jiv/get_file.php?file=pic/" 
                    . $FileObj->getParameter('check_pic_filename'),
                'FullFilename' => $FileObj->getParameter('File'),
                'JivFilename' => basename($FileObj->getParameter('File')),
                'JivAddress' => str_replace(
                    '_check.jpg', '', $FileObj->getParameter('check_pic_filename')
                ),
                'New' => ($FileObj->getParameter('QCFirstChangeTime') == '') ? 1 : 0,
                'Pipeline' => $FileObj->getParameter('Pipeline'),
                'OutputType' => $FileObj->getParameter('OutputType'),
                'AcquisitionProtocol' => $FileObj->getAcquisitionProtocol(),
                'CoordinateSpace' => $FileObj->getParameter('CoordinateSpace'),
                'Algorithm' => $FileObj->getParameter('Algorithm'),
                'AcquisitionDate' => $this->_getDate(
                    $FileObj, 'acquisition_date', $acqDate
                ), 
                'ProcDate' => $this->_getDate(
                    $FileObj, 'processing:processing_date', $procDate
                ),
                'FileInsertDate' => $FileObj->getParameter('InsertTime'),
                'SeriesDescription' => $FileObj->getParameter('series_description'),
                'SeriesNumber' => $FileObj->getParameter('series_number'),
                'EchoTime' => number_format(
                    $FileObj->getParameter('echo_time')*1000, 2
                ),
                'RepetitionTime' => number_format(
                    $FileObj->getParameter('repetition_time')*1000, 2
                ),
                'SliceThickness' => number_format(
                    $FileObj->getParameter('slice_thickness'), 2
                ),
                'Time' => number_format($FileObj->getParameter('time'), 2),
                'Comment' => $FileObj->getParameter('Comment'),
                'ProcessingPipeline' => $FileObj->getParameter(
                    'processing:pipeline'
                ),
                'TotalRejected' => $FileObj->getParameter(
                    'processing:total_rejected'
                ),
                'SourceFile' => basename(
                    $FileObj->getParameter('processing:sourceFile')
                ),
                'Tool' => $FileObj->getParameter('Tool'),
                'SlicewiseRejected' => $this->_getRejected(
                    $FileObj, 'slicewise', $sliceRej
                ),
                'InterlaceRejected' => $this->_getRejected(
                    $FileObj, 'interlace', $laceRej
                ),
                'IntergradientRejected' => $this->_getRejected(
                    $FileObj, 'intergradient', $interRej
                ), 
                'Xstep' => number_format($FileObj->getParameter('xstep'), 2),
                'Ystep' => number_format($FileObj->getParameter('ystep'), 2),
                'Zstep' => number_format($FileObj->getParameter('zstep'), 2),
                'Selected' => $FileObj->getParameter('Selected'),
                'QCStatus' => $FileObj->getParameter('QCStatus'),
                'QCDate' => $FileObj->getParameter('QCLastChangeTime'),
                'Caveat' => $FileObj->getParameter('Caveat'),
                'SNR' => $FileObj->getParameter('SNR'),
                'SeriesUID' => $FileObj->getParameter('SeriesUID'),
                'XMLreport' => $FileObj->getParameter('processing:DTIPrepXmlReport'),
                'XMLprotocol' => $FileObj->getParameter('ProtocolFile'),
                'NrrdFile' => $FileObj->getParameter('processing:nrrd_file'),
                'OtherTimepoints' => $this->_getFilesAcrossTimepoints((int)$FileObj->getParameter('SessionID'),
                (int)$FileObj->getParameter('AcquisitionProtocolID'))
            );
            $this->tpl_data['files'][] = $file;
        }
    }
    /**
    * Gets a rejected parameter according to its type
    * 
    * @param MRIFile $file  file object 
    * @param string  $type  type of the rejected
    * @param array   $array array containing rejected
    *
    * @return parameter of the rejected
    */
    function _getRejected($file, $type, $array) 
    {
        $parameter = 'processing:' . $type . '_rejected';
        if (preg_match(
            "/(Directions)([^\(]+)(\(\d+\))/", 
            $file->getParameter($parameter), $array
        )) {
            $dirList = preg_split('/\,/', $array[2]);
            if (count($dirList) > 1) {
                sort($dirList);
            }
            return "Directions " . join(", ", $dirList) . " " . $array[3]; 
        } else {
            return $file->getParameter($parameter);
        }
    }
    /**
    * Gets the date according to the type
    * 
    * @param MRIFile $file  file object 
    * @param string  $type  type of the date
    * @param array   $array array containing the date
    *
    * @return date if exists, if not an empty string
    */
    function _getDate($file, $type, $array)
    {
        if (preg_match(
            "/(\d{4})-?(\d{2})-?(\d{2})/", 
            $file->getParameter($type), $array
        )) {
            return (mktime(12, 0, 0, $array[2], $array[3], $array[1]));
        } else {
            return "";
        } 
    }
    /**
    * Updates QCStatus in the form
    *
    * @param array $values in the $_POST array
    *    
    * @return NULL
    */
    function _updateStatus($values) 
    {
        if (is_array($values['status'])) {
            foreach ($values['status'] AS $curFileID => $curStatus) {
                if ($curStatus == 'unrated') {
                    $curStatus='';
                }
                $updateSet = array(
                    'QCStatus'=>$curStatus, 'QCLastChangeTime'=>time()
                );

                // set first change time, if it's null only
                $params = array('FID' => $curFileID);
                $firstChangeTime = $this->DB->pselectOne(
                    "SELECT QCFirstChangeTime 
                    FROM files_qcstatus 
                    WHERE FileID=:FID", $params
                );
                if (empty($firstChangeTime)) {
                    $updateSet['QCFirstChangeTime'] = time();
                }

                $QCExists = $this->DB->pselectOne(
                    "SELECT 'x' 
                    FROM files_qcstatus 
                    WHERE FileID=:FID", $params
                );
                if (!empty($QCExists)) {
                    $updateWhere['FileID'] = $curFileID;
                    $success = $this->DB->update(
                        'files_qcstatus', $updateSet, $updateWhere
                    );
                } else {
                    $file = new MRIFile($curFileID);
                    $updateSet['SeriesUID'] = $file->getParameter(
                        'series_instance_uid'
                    );
                    $updateSet['EchoTime'] = $file->getParameter('echo_time');
                    $updateSet['FileID'] = $curFileID;
                    $this->DB->insert("files_qcstatus", $updateSet);
                }
            }
        }
        if (is_array($values['caveat'])) {
            $user = User::singleton();
            $timePoint =& TimePoint::singleton($this->sessionID);
            $candid = $timePoint->getCandID();
            $visit_label = $timePoint->getData('Visit_label');

            foreach ($values['caveat'] as $curFileID => $curCaveat) {
                if ($curCaveat === '') {
                    $curCaveat = null;
                }
                $this->DB->update(
                    "files",
                    array('Caveat' => $curCaveat),
                    array('FileID' => $curFileID)
                );

                if ($curCaveat == true) {
                    $file = new MRIFile($curFileID);
                    $insertSet['SeriesUID'] = $file->getParameter(
                        'series_instance_uid'
                    );
                    $insertSet['TarchiveID'] = $file->getParameter('TarchiveSource');
                    $insertSet['MincFile'] = $file->getParameter('File');
                    $insertSet['PatientName'] = $file->getParameter('patient_name');
                    $insertSet['CandID'] = $candid;
                    $insertSet['Visit_label'] = $visit_label;
                    $insertSet['CheckID'] = null;
                    $insertSet['Severity'] = 'warning';
                    $insertSet['Header'] = 'Manual Caveat Set by ' 
                        . $user->getUsername();

                    $this->DB->insert("mri_violations_log", $insertSet);
                }
            }
        }
    }
    /**
    * updates selections
    *
    * @return NULL
    */
    function _updateSelected() 
    {
        // update selected's
        if (is_array($_POST['selectedvol'])) {
            foreach ($_POST['selectedvol'] AS $curFileID => $curSelected) {
                $params = array('FID' => $curFileID);
                $updateWhere = array(
                    'FileID' => $curFileID
                );

                if ($curSelected == 'Unselected') {
                    if ($this->DB->pselectOne(
                        "SELECT COUNT(*) 
                        FROM files_qcstatus 
                        WHERE FileID=:FID ", $params
                    ) > 0) {
                        $success = $this->DB->delete('files_qcstatus', $updateWhere);
                    }
                } else {
                    if ($this->DB->pselectOne(
                        "SELECT COUNT(*) 
                        FROM files_qcstatus
                        WHERE FileID=:FID ", $params
                    ) > 0) {
                        $updateSet = array(
                            'Selected'=>$curSelected, 'QCLastChangeTime'=>time()
                        );
                        $success = $this->DB->update(
                            'files_qcstatus', $updateSet, $updateWhere
                        );
                    } else {
                        $insertSet = array(
                            'FileID' => $curFileID, 
                            'Selected'=> $curSelected, 
                            'QCFirstChangeTime'=>time()
                        );
                        $success = $this->DB->insert('files_qcstatus', $insertSet);
                    }
                }
            }
        }
    }
    /**
    * Updates status
    *
    * @return NULL
    */
    function _updateVisitStatus() 
    {
        if (!empty($_POST['visit_status'])) {
            $save_visit_status 
                = $_POST['visit_status'] == 'Unrated' ? '' : $_POST['visit_status'];
            $params = array('SID' => $this->sessionID);
            $old_visit_status = $this->DB->pselectOne(
                "SELECT MRIQCStatus 
                FROM session 
                WHERE ID=:SID", $params
            );
            $old_pending_status = $this->DB->pselectOne(
                "SELECT MRIQCPending 
                FROM session 
                WHERE ID=:SID", $params
            );

            $updateSet = array(
                'MRIQCPending' => $_POST['visit_pending'], 
                'MRIQCStatus' => $_POST['visit_status'], 
                'MRIQCLastChangeTime' => date("Y-m-d H:i:s")
            );
            $firstChangeTime = $this->DB->pselectOne(
                "SELECT MRIQCFirstChangeTime 
                FROM session 
                WHERE ID=:SID", $params
            );
            if (empty($firstChangeTime)) {
                $updateSet['MRIQCFirstChangeTime'] 
                    = $updateSet['MRIQCLastChangeTime'];
            }
            $success = $this->DB->update(
                'session', $updateSet, array('ID'=>$this->sessionID)
            );
            // sppool a message to the mri qc status rss channel
            if (($save_visit_status != $old_visit_status) 
                || ($old_pending_status != $_POST['visit_pending'])
            ) {
                $timePoint =& TimePoint::singleton($this->sessionID);
                $candid = $timePoint->getCandID();
                $candidate =& Candidate::singleton($timePoint->getCandID());
                $pscid = $candidate->getPSCID();
                $visit_label = $timePoint->getVisitLabel();
                $not_status = ($_POST['visit_pending'] == 'Y' ? 'Pending ' : '') 
                    . $_POST['visit_status'];
                $message = "$candid / $pscid $visit_label 
                    - MRI QC status changed to $not_status";
                $centerID = $timePoint->getCenterID();

                $notifier = new Notify;
                $notifier->spool('mri qc status', $message, $centerID);
                unset($timePoint, $candid, $candidate, $pscid, 
                    $visit_label, $message, $centerID, $notifier, $not_status
                );
            }
        }
    }

    /**
     * Gets candidate's scans with the same acquisitionID.
     *
     * @return string of FileIDs, comma separated
     */
    function _getFilesAcrossTimepoints($initialFileID, $initialFileAcquisitionID){

        $selectResults = $this->DB->pselect("SELECT FileID FROM files ".
            "WHERE AcquisitionProtocolID =:initialFileAcquisitionID ".
            "AND SessionID in (SELECT s2.ID FROM session s1 RIGHT JOIN session s2 ".
            "ON s1.CandID = s2.CandID WHERE s1.ID =:initialFileID)",
            array(
                'initialFileAcquisitionID' => $initialFileAcquisitionID,
                'initialFileID' => $initialFileID
            )
        );

        $fileIDS = array();
        foreach($selectResults as $selectResult) {
            $fileIDS[] = $selectResult['FileID'];
        }
        $fileIDString = implode(",", $fileIDS);
        return $fileIDString;
    }

    /**
    * Gets header table html
    *
    * @return $html of the header table
    */
    function getHeaderTable() 
    {
        $tpl_data = array();
        $tpl_data['subject'] = $this->getSubjectData();
        
        if (!empty($_REQUEST['outputType'])) {
            $tpl_data['outputType'] = urldecode($_REQUEST['outputType']);
        }
        $config = NDB_Config::singleton();
        if ($config->getSetting('useEDC') === 'true') {
            $tpl_data['useEDC'] = true;
        }

        $smarty = new Smarty_neurodb('imaging_browser');

        $smarty->assign($tpl_data);
        $html = $smarty->fetch("table_session_header.tpl");
        return $html;
    }
    /**
    * Populates data for the template
    *
    * @return $subjectData array with data
    */
    function getSubjectData() 
    {
        $timePoint =& TimePoint::singleton($_REQUEST['sessionID']);

        $subjectData['sessionID'] = $_REQUEST['sessionID'];
        $subjectData['SubprojectID'] = $timePoint->getSubprojectID();
        $subjectData['SubprojectTitle'] = $timePoint->getData('SubprojectTitle');
        $subjectData['visitLabel'] = $timePoint->getVisitLabel();
        $subjectData['visitNo'] = $timePoint->getVisitNo();
        $subjectData['site'] = $timePoint->getPSC();
        $qcstatus = $this->DB->pselectRow(
            "SELECT MRIQCStatus, MRIQCPending 
            FROM session WHERE ID=:SID", 
            array('SID' => $_REQUEST['sessionID'])
        );
        $subjectData['mriqcstatus'] = $qcstatus['MRIQCStatus'];
        $subjectData['mriqcpending'] = $qcstatus['MRIQCPending'];
        $subjectData['candid'] = $timePoint->getCandID();
        $subjectData['scanner'] = $this->scanner;

        $candidate =& Candidate::singleton($timePoint->getCandID());
        $subjectData['pscid'] = $candidate->getPSCID();
        $subjectData['dob'] = $candidate->getCandidateDoB();
        $subjectData['edc'] = $candidate->getCandidateEDC();
        $subjectData['gender'] = $candidate->getCandidateGender();

        // This doesn't work. 
        //Need to find the proper way to get the TarchiveID. 
        //It should be per file, not per candidate. --Dave
        $params = array();
        $EntityType = $candidate->getData('Entity_type');
        if ($EntityType == 'Scanner') {
            $ID = ":PPSCID";
            $params['PPSCID'] = $timePoint->getData('PSCID');
        } else {
            $ID = "LOWER(CONCAT(:PPSCID, '_', :PCandID, '_', :PVL, '%'))";
            $params['PPSCID'] = $candidate->getPSCID();
            $params['PCandID'] = $timePoint->getCandID();
            $params['PVL'] = $timePoint->getVisitLabel();
        }
        $tarchiveIDs = $this->DB->pselect(
            "SELECT TarchiveID 
            FROM tarchive 
            WHERE PatientName LIKE $ID", $params
        );
        $subjectData['tarchiveids'] = $tarchiveIDs;
        // Cache the data
        return $subjectData;
    }
    /**
    * Gets control panel
    *
    * @return $controlPanel
    */
    function getControlPanel() 
    {
        $controlPanel = new Imaging_Session_ControlPanel($_REQUEST['sessionID']);
        return $controlPanel->display();
    }

    function getJSDependencies() {
        $depends = parent::getJSDependencies();
        if($this->page === 'viewSession') {
            $factory = NDB_Factory::singleton();
            $baseurl = $factory->settings()->getBaseURL();
            $depends = array_merge($depends,
                array(
                    $baseurl . "/imaging_browser/js/jiv_and_imaging_browser.js",
                    $baseurl . "/imaging_browser/js/ImagePanel.js"
                ));

        }
        return $depends;
    }
}

?>
