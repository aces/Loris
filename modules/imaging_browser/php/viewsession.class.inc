<?php

/**
 * Form_imaging_browser class file
 *
 * PHP version 5
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Loris team <info-loris.mni@mcgill.ca>
 * @license    Loris License
 * @link       https://github.com/aces/Loris-Trunk
 */
namespace LORIS\imaging_browser;
/**
 * NDB_Form_Imaging_Browser Class
 *
 * This class is imaging_browser Form
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Loris team <info-loris.mni@mcgill.ca>
 * @license    Loris License
 * @link       https://github.com/aces/Loris-Trunk
 */

class ViewSession extends \NDB_Form
{
    /**
     * Var to store the scanner information.
     * Will be used from the last file.
     */
    var $scanner;
    /**
     * Var to store the sessionID.
     */
    var $sessionID;

    /**
     * Determine whether the user has permission to view the
     * imaging_browser page
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool whether the user has access
     */
    function _hasAccess(\User $user) : bool
    {
        /* User has access if they have an 'all site' permission or if they are
        * part of a study site and are permitted to view their own site.
         */
        return $user->hasAnyPermission(
            array(
             'imaging_browser_view_allsites',
             'imaging_browser_phantom_allsites',
             'imaging_browser_phantom_ownsite',
            )
        )
        || $user->hasCenterPermission(
            'imaging_browser_view_site',
            \TimePoint::singleton($_REQUEST['sessionID'])->getCenterID()
        );
    }

    /**
     * Determine whether the user has permission to QC the imaging_browser page
     *
     * @return bool whether the user has QC permission
     */
    function _hasQCPerm()
    {
        return \User::singleton()->hasPermission('imaging_browser_qc');
    }

    /**
     * Sets up main parameters
     *
     * @return void
     */
    function setup()
    {
        parent::setup();
        $this->DB = \Database::singleton();

        $this->sessionID = $_REQUEST['sessionID'];

        if (!empty($this->sessionID) && is_numeric($this->sessionID)) {
            $user = \User::singleton();
            if ($this->_hasAccess($user) && isset($_POST['save_changes'])) {
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
                array('sid' => $this->sessionID)
            );
            if (!empty($file)) {
                $this->tpl_data['show3DViewer'] = true;
            }

            $this->tpl_data['status_options']    = array(
                                                    ''     => '&nbsp;',
                                                    'Pass' => 'Pass',
                                                    'Fail' => 'Fail',
                                                   );
            $this->tpl_data['caveat_options']    = array(
                                                    ''    => '&nbsp;',
                                                    true  => 'True',
                                                    false => 'False',
                                                   );
            $this->tpl_data['has_permission']    = ($this->_hasAccess($user)) ?
                                                 true : false;
            $this->tpl_data['has_qc_permission'] = ($this->_hasQCPerm()) ?
                                                    true : false;
            if ($this->_hasQCPerm()) {
                $this->FormAction = "/imaging_browser/viewSession/?sessionID=" .
                         $this->sessionID;
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
        $args = array('SID' => $this->sessionID);
        // To better support QC for CIVET output a couple of
        // additional conditions have been put in...
        if (!empty($_REQUEST['outputType'])) {
            $outputType = urldecode($_REQUEST['outputType']);
            if ($outputType=="processed") {
                $extra_where_string .= " AND OutputType != 'native' ";
            } elseif ($outputType=="native") {
                $extra_where_string .= " AND OutputType='native'";
            } elseif ($outputType=="skull_mask") {
                $extra_where_string .= " AND (OutputType='skull_mask' 
                    OR  (OutputType='native' AND AcquisitionProtocolID='44') )";
            } else {
                $extra_where_string .= " AND (OutputType=:outputType 
                    OR OutputType='linreg')";

                $args["outputType"] = $outputType;
            }
        }
        $files = $this->DB->pselect(
            "SELECT files.FileID, files.ScannerID FROM files 
             LEFT JOIN files_qcstatus as sel 
             on (files.FileID=sel.FileID) 
            WHERE SessionID=:SID AND (AcquisitionProtocolID IS NULL 
            OR AcquisitionProtocolID not in (1, 2, 3, 52)) 
            $extra_where_string 
            ORDER BY files.OutputType, 
                     files.AcquisitionProtocolID, 
                     files.File",
            $args
        );
        $this->tpl_data['files'] = array();
        foreach ($files as $fileRow) {
            $FileObj = new \MRIFile($fileRow['FileID']);
            if (empty($scannerID)) {
                $scannerID = $fileRow['ScannerID'];
                if (!empty($scannerID)) {
                    $query         = "SELECT CONCAT_WS(' ', Manufacturer, Model,".
                             " Serial_number) FROM mri_scanner WHERE ID=:ScanID";
                    $this->scanner = $this->DB->pselectOne(
                        $query,
                        array('ScanID' => $scannerID)
                    );
                }
            }

            $FullFilename     = $FileObj->getParameter('File') ?? '';
            $checkPicFilename = $FileObj->getParameter(
                'check_pic_filename'
            ) ?? '';
            $FileID           = $fileRow['FileID'];
            $Filename         = $JivFilename = basename($FullFilename);
            $CheckPic         = "/mri/jiv/get_file.php?file=pic/". $checkPicFilename;
            $JivAddress       = str_replace(
                '_check.jpg',
                '',
                $checkPicFilename
            );
            $New        = ($FileObj->getParameter('QCFirstChangeTime') == '') ?
                                         1 : 0;
            $Pipeline   = $FileObj->getParameter('Pipeline');
            $OutputType = $FileObj->getParameter('OutputType');
            $AcquisitionProtocol = $FileObj->getAcquisitionProtocol();
            $CoordinateSpace     = $FileObj->getParameter('CoordinateSpace');
            $Algorithm           = $FileObj->getParameter('Algorithm');
            $AcquisitionDate     = $this->_getDate(
                $FileObj,
                'acquisition_date'
            );
            $ProcDate            = $this->_getDate(
                $FileObj,
                'processing:processing_date'
            );
            $FileInsertDate      = $FileObj->getParameter('InsertTime');
            $SeriesDescription   = $FileObj->getParameter('series_description');
            $SeriesNumber        = $FileObj->getParameter('series_number');
            $SeriesUID           = $FileObj->getParameter('series_instance_uid');
            $EchoTime            = number_format(
                (int)$FileObj->getParameter('echo_time')*1000,
                2
            );
            $RepetitionTime      = number_format(
                (int)$FileObj->getParameter('repetition_time') * 1000,
                2
            );
            $SliceThickness      = number_format(
                intval($FileObj->getParameter('slice_thickness')),
                2
            );
            $Time    = number_format(
                intval($FileObj->getParameter('time')),
                2
            );
            $Comment = $FileObj->getParameter('Comment');
            $ProcessingPipeline = $FileObj->getParameter('processing:pipeline');
            $TotalRejected      = $FileObj->getParameter(
                'processing:total_rejected'
            );
            $SourceFile         = basename(
                $FileObj->getParameter('processing:sourceFile') ?? ''
            );
            $Tool = $FileObj->getParameter('Tool');
            $SlicewiseRejected     = $this->_getRejected(
                $FileObj,
                'slicewise'
            );
            $InterlaceRejected     = $this->_getRejected(
                $FileObj,
                'interlace'
            );
            $IntergradientRejected = $this->_getRejected(
                $FileObj,
                'intergradient'
            );
            $Xstep       = number_format(intval($FileObj->getParameter('xstep')), 2);
            $Ystep       = number_format(intval($FileObj->getParameter('ystep')), 2);
            $Zstep       = number_format(intval($FileObj->getParameter('zstep')), 2);
            $Selected    = $this->_getSelected(
                (int) $FileObj->getParameter('FileID')
            );
            $QCStatus    = $FileObj->getParameter('QCStatus');
            $QCDate      = $FileObj->getParameter('QCLastChangeTime');
            $Caveat      = $FileObj->getParameter('Caveat');
            $SNR         = $FileObj->getParameter('SNR');
            $SeriesUID   = $FileObj->getParameter('SeriesUID');
            $XMLreport   = $FileObj->getParameter('processing:DTIPrepXmlReport');
            $XMLprotocol = $FileObj->getParameter('ProtocolFile');
            $NrrdFile    = $FileObj->getParameter('processing:nrrd_file');
            $OtherTimepoints = $this->_getFilesAcrossTimepoints(
                (int)$FileObj->getParameter('SessionID'),
                (int)$FileObj->getParameter('AcquisitionProtocolID')
            );

            $file = array(
                     'FileID'                => $FileID,
                     'Filename'              => $Filename,
                     'CheckPic'              => $CheckPic,
                     'FullFilename'          => $FullFilename,
                     'JivFilename'           => $JivFilename,
                     'JivAddress'            => $JivAddress,
                     'New'                   => $New,
                     'Pipeline'              => $Pipeline,
                     'OutputType'            => $OutputType,
                     'AcquisitionProtocol'   => $AcquisitionProtocol,
                     'CoordinateSpace'       => $CoordinateSpace,
                     'Algorithm'             => $Algorithm,
                     'AcquisitionDate'       => $AcquisitionDate,
                     'ProcDate'              => $ProcDate,
                     'FileInsertDate'        => $FileInsertDate,
                     'SeriesDescription'     => $SeriesDescription,
                     'SeriesNumber'          => $SeriesNumber,
                     'SeriesUID'             => $SeriesUID,
                     'EchoTime'              => $EchoTime,
                     'RepetitionTime'        => $RepetitionTime,
                     'SliceThickness'        => $SliceThickness,
                     'Time'                  => $Time,
                     'Comment'               => $Comment,
                     'ProcessingPipeline'    => $ProcessingPipeline,
                     'TotalRejected'         => $TotalRejected,
                     'SourceFile'            => $SourceFile,
                     'Tool'                  => $Tool,
                     'SlicewiseRejected'     => $SlicewiseRejected,
                     'InterlaceRejected'     => $InterlaceRejected,
                     'IntergradientRejected' => $IntergradientRejected,
                     'Xstep'                 => $Xstep,
                     'Ystep'                 => $Ystep,
                     'Zstep'                 => $Zstep,
                     'Selected'              => $Selected,
                     'QCStatus'              => $QCStatus,
                     'QCDate'                => $QCDate,
                     'Caveat'                => $Caveat,
                     'SNR'                   => $SNR,
                     'SeriesUID'             => $SeriesUID,
                     'XMLreport'             => $XMLreport,
                     'XMLprotocol'           => $XMLprotocol,
                     'NrrdFile'              => $NrrdFile,
                     'OtherTimepoints'       => $OtherTimepoints,
                    );
            $this->tpl_data['files'][] = $file;
        }
    }
    /**
     * Gets a rejected parameter according to its type
     *
     * @param \MRIFile $file file object
     * @param string   $type type of the rejected
     *
     * @return ?string The parameter of the rejected
     */
    function _getRejected(\MRIFile $file, string $type): ?string
    {
        $array     = array();
        $parameter = 'processing:' . $type . '_rejected';
        if (preg_match(
            "/(Directions)([^\(]+)(\(\d+\))/",
            $file->getParameter($parameter) ?? '',
            $array
        )
        ) {
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
     * @param \MRIFile $file file object
     * @param string   $type type of the date
     *
     * @return int|string The date if exists, if not an empty string
     */
    function _getDate(\MRIFile $file, string $type)
    {
        $array = array();
        if (preg_match(
            "/(\d{4})-?(\d{2})-?(\d{2})/",
            $file->getParameter($type) ?? '',
            $array
        )
        ) {
            return mktime(
                12,
                0,
                0,
                (int) $array[2],
                (int) $array[3],
                (int) $array[1]
            );
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
                    $curStatus ='';
                }
                $updateSet = array(
                              'QCStatus'         => $curStatus,
                              'QCLastChangeTime' => time(),
                             );

                // set first change time, if it's null only
                $params          = array('FID' => $curFileID);
                $firstChangeTime = $this->DB->pselectOne(
                    "SELECT QCFirstChangeTime 
                    FROM files_qcstatus 
                    WHERE FileID=:FID",
                    $params
                );
                if (empty($firstChangeTime)) {
                    $updateSet['QCFirstChangeTime'] = time();
                }

                $QCExists  = $this->DB->pselectOne(
                    "SELECT 'x' 
                    FROM files_qcstatus 
                    WHERE FileID=:FID",
                    $params
                );
                $updateSet = \Utility::nullifyEmpty($updateSet, 'QCStatus');
                if (!empty($QCExists)) {
                    $updateWhere['FileID'] = $curFileID;
                    $success = $this->DB->update(
                        'files_qcstatus',
                        $updateSet,
                        $updateWhere
                    );
                } else {
                    $file = new \MRIFile($curFileID);
                    $updateSet['SeriesUID'] = $file->getParameter(
                        'series_instance_uid'
                    );
                    $updateSet['EchoTime']  = $file->getParameter('echo_time');
                    $updateSet['FileID']    = $curFileID;
                    $this->DB->insert("files_qcstatus", $updateSet);
                }
            }
        }
        if (is_array($values['caveat'])) {
            $user        = \User::singleton();
            $timePoint   =& \TimePoint::singleton($this->sessionID);
            $candid      = $timePoint->getCandID();
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
                    $file = new \MRIFile($curFileID);
                    $insertSet['SeriesUID']   = $file->getParameter(
                        'series_instance_uid'
                    );
                    $insertSet['TarchiveID']  = $file->getParameter(
                        'TarchiveSource'
                    );
                    $insertSet['MincFile']    = $file->getParameter('File');
                    $insertSet['PatientName'] = $file->getParameter('patient_name');
                    $insertSet['CandID']      = $candid;
                    $insertSet['Visit_label'] = $visit_label;
                    $insertSet['CheckID']     = null;
                    $insertSet['Scan_type']   = $file->getParameter(
                        'AcquisitionProtocolID'
                    );
                    $insertSet['Severity']    = 'warning';
                    $insertSet['Header']      = 'Manual Caveat Set by '
                        . $user->getUsername();

                    $this->DB->insert("mri_violations_log", $insertSet);
                }
            }
        }
    }
    /**
     * Updates selections
     *
     * @return NULL
     */
    function _updateSelected()
    {
        // update selected's
        if (is_array($_POST['selectedvol'])) {
            foreach ($_POST['selectedvol'] AS $curFileID => $curSelected) {
                $params      = array('FID' => $curFileID);
                $updateWhere = array('FileID' => $curFileID);

                if ($curSelected == 'Unselected') {
                    if ($this->DB->pselectOne(
                        "SELECT COUNT(*) 
                        FROM files_qcstatus 
                        WHERE FileID=:FID ",
                        $params
                    ) > 0
                    ) {
                        $success = $this->DB->delete('files_qcstatus', $updateWhere);
                    }
                } else {
                    if ($this->DB->pselectOne(
                        "SELECT COUNT(*) 
                        FROM files_qcstatus
                        WHERE FileID=:FID ",
                        $params
                    ) > 0
                    ) {
                        $updateSet = array(
                                      'Selected'         => $curSelected,
                                      'QCLastChangeTime' => time(),
                                     );
                        $updateSet = \Utility::nullifyEmpty($updateSet, 'Selected');
                        $success   = $this->DB->update(
                            'files_qcstatus',
                            $updateSet,
                            $updateWhere
                        );
                    } else {
                        $insertSet = array(
                                      'FileID'            => $curFileID,
                                      'Selected'          => $curSelected,
                                      'QCFirstChangeTime' => time(),
                                     );
                        $insertSet = \Utility::nullifyEmpty($insertSet, 'Selected');
                        $success   = $this->DB->insert('files_qcstatus', $insertSet);
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
            $params           = array('SID' => $this->sessionID);
            $old_visit_status = $this->DB->pselectOne(
                "SELECT MRIQCStatus 
                FROM session 
                WHERE ID=:SID",
                $params
            );
            $old_pending_status = $this->DB->pselectOne(
                "SELECT MRIQCPending 
                FROM session 
                WHERE ID=:SID",
                $params
            );
            $old_caveat_status  = $this->DB->pselectOne(
                "SELECT MRICaveat 
                FROM session 
                WHERE ID=:SID",
                $params
            );

            $updateSet       = array(
                                'MRIQCPending'        => $_POST['visit_pending'],
                                'MRIQCStatus'         => $_POST['visit_status'],
                                'MRICaveat'           => $_POST['visit_caveat'],
                                'MRIQCLastChangeTime' => date("Y-m-d H:i:s"),
                               );
            $firstChangeTime = $this->DB->pselectOne(
                "SELECT MRIQCFirstChangeTime 
                FROM session 
                WHERE ID=:SID",
                $params
            );
            if (empty($firstChangeTime)) {
                $updateSet['MRIQCFirstChangeTime']
                    = $updateSet['MRIQCLastChangeTime'];
            }
            $updateSet = \Utility::nullifyEmpty($updateSet, 'MRIQCStatus');
            $success   = $this->DB->update(
                'session',
                $updateSet,
                array('ID' => $this->sessionID)
            );
            // spool a message to the mri qc status rss channel
            if (($_POST['visit_status'] != $old_visit_status)
                || ($old_pending_status != $_POST['visit_pending'])
                || ($old_caveat_status != $_POST['visit_caveat'])
            ) {
                $timePoint   =& \TimePoint::singleton($this->sessionID);
                $candid      = $timePoint->getCandID();
                $candidate   =& \Candidate::singleton($timePoint->getCandID());
                $pscid       = $candidate->getPSCID();
                $visit_label = $timePoint->getVisitLabel();
                $not_status  = ($_POST['visit_pending'] == 'Y' ? 'Pending ' : '')
                    . $_POST['visit_status']
                    . $_POST['visit_caveat'];
                $message     = "$candid / $pscid $visit_label 
                    - MRI QC status changed to $not_status";
                $centerID    = $timePoint->getCenterID();

                $notifier = new \Notify;
                $notifier->spool('mri qc status', $message, $centerID);
                unset(
                    $timePoint,
                    $candid,
                    $candidate,
                    $pscid,
                    $visit_label,
                    $message,
                    $centerID,
                    $notifier,
                    $not_status
                );
            }
        }
    }

    /**
     * Gets candidate's scans with the same acquisitionID.
     *
     * @param string $initialFileID            the value of initialFileID
     * @param string $initialFileAcquisitionID the value of initialFileAcquisitionID
     *
     * @return string of FileIDs, comma separated
     */
    function _getFilesAcrossTimepoints($initialFileID, $initialFileAcquisitionID)
    {

        $selectResults = $this->DB->pselect(
            "SELECT FileID FROM files ".
            "WHERE AcquisitionProtocolID =:initialFileAcquisitionID ".
            "AND SessionID in (SELECT s2.ID FROM session s1 RIGHT JOIN session s2 ".
            "ON s1.CandID = s2.CandID WHERE s1.ID =:initialFileID)",
            array(
             'initialFileAcquisitionID' => $initialFileAcquisitionID,
             'initialFileID'            => $initialFileID,
            )
        );

        $fileIDS = array();
        foreach ($selectResults as $selectResult) {
            $fileIDS[] = $selectResult['FileID'];
        }
        $fileIDString = implode(",", $fileIDS);
        return $fileIDString;
    }

    /**
     * Gets Selected status from files_qcstatus for a given FileID
     *
     * @param string $FileID the value of FileID
     *
     * @return ?string
     */
    function _getSelected($FileID): ?string
    {

        $selected = $this->DB->pselectOne(
            "SELECT Selected FROM files_qcstatus ".
            "WHERE FileID =:FileID",
            array('FileID' => $FileID)
        );
        return $selected;
    }

    /**
     * Gets header table html
     *
     * @return string ($html of the header table)
     */
    function getHeaderTable()
    {
        $tpl_data            = array();
        $tpl_data['subject'] = $this->getSubjectData();

        if (!empty($_REQUEST['outputType'])) {
            $tpl_data['outputType'] = urldecode($_REQUEST['outputType']);
        }
        $config = \NDB_Config::singleton();
        if ($config->getSetting('useEDC') === 'true') {
            $tpl_data['useEDC'] = true;
        }

        $smarty = new \Smarty_neurodb('imaging_browser');

        $smarty->assign($tpl_data);
        $html = $smarty->fetch("table_session_header.tpl");
        return $html;
    }
    /**
     * Populates data for the template
     *
     * @return array ($subjectData array with data)
     */
    function getSubjectData()
    {
        $timePoint =& \TimePoint::singleton($_REQUEST['sessionID']);

        $subjectData['sessionID']       = $_REQUEST['sessionID'];
        $subjectData['SubprojectID']    = $timePoint->getSubprojectID();
        $subjectData['SubprojectTitle'] = $timePoint->getData('SubprojectTitle');
        $subjectData['visitLabel']      = $timePoint->getVisitLabel();
        $subjectData['visitNo']         = $timePoint->getVisitNo();
        $subjectData['site']            = $timePoint->getPSC();
        $qcstatus = $this->DB->pselectRow(
            "SELECT MRIQCStatus, MRIQCPending, MRICaveat 
            FROM session WHERE ID=:SID",
            array('SID' => $_REQUEST['sessionID'])
        );
        $subjectData['mriqcstatus']  = $qcstatus['MRIQCStatus'];
        $subjectData['mriqcpending'] = $qcstatus['MRIQCPending'];
        $subjectData['mricaveat']    = $qcstatus['MRICaveat'];
        $subjectData['candid']       = $timePoint->getCandID();
        $subjectData['scanner']      = $this->scanner;

        $candidate            =& \Candidate::singleton($timePoint->getCandID());
        $subjectData['pscid'] = $candidate->getPSCID();
        $subjectData['dob']   = $candidate->getCandidateDoB();
        $subjectData['edc']   = $candidate->getCandidateEDC();
        $subjectData['sex']   = $candidate->getCandidateSex();

        // This doesn't work.
        //Need to find the proper way to get the TarchiveID.
        //It should be per file, not per candidate. --Dave
        $params     = array();
        $EntityType = $candidate->getData('Entity_type');
        if ($EntityType == 'Scanner') {
            $ID = ":PPSCID";
            $params['PPSCID'] = $timePoint->getData('PSCID');
        } else {
            $ID = "LOWER(CONCAT(:PPSCID, '_', :PCandID, '_', :PVL, '%'))";
            $params['PPSCID']  = $candidate->getPSCID();
            $params['PCandID'] = $timePoint->getCandID();
            $params['PVL']     = $timePoint->getVisitLabel();
        }
        $tarchiveIDs = $this->DB->pselect(
            "SELECT TarchiveID 
            FROM tarchive 
            WHERE PatientName LIKE $ID",
            $params
        );
        $subjectData['tarchiveids'] = $tarchiveIDs;
        // Cache the data
        return $subjectData;
    }
    /**
     * Gets control panel
     *
     * @return string ($controlPanel)
     */
    function getControlPanel()
    {
        $controlPanel = new Imaging_Session_ControlPanel($_REQUEST['sessionID']);
        return $controlPanel->display();
    }
    /**
     * Get js Dependencies
     *
     * @return array
     */
    function getJSDependencies()
    {
        $depends = parent::getJSDependencies();
        $factory = \NDB_Factory::singleton();
        $baseurl = $factory->settings()->getBaseURL();
        $depends = array_merge(
            $depends,
            array(
             $baseurl . "/imaging_browser/js/jiv_and_imaging_browser.js",
             $baseurl . "/imaging_browser/js/ImagePanel.js",
            )
        );
        return $depends;
    }

    /**
     * Include additional CSS files:
     *  1. imaging_browser.css
     *
     * @return array of css to be inserted
     */
    function getCSSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getCSSDependencies();
        return array_merge(
            $deps,
            [$baseURL . "/imaging_browser/css/imaging_browser.css"]
        );
    }

    /**
     * Generate a breadcrumb trail for this page.
     *
     * @return \LORIS\BreadcrumbTrail
     */
    public function getBreadcrumbs(): \LORIS\BreadcrumbTrail
    {
        return new \LORIS\BreadcrumbTrail(
            new \LORIS\Breadcrumb('Imaging Browser', '/imaging_browser'),
            new \LORIS\Breadcrumb(
                'View Session',
                "/imaging_browser/viewSession/?sessionID=$this->sessionID"
            )
        );
    }

}

