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
    private \Database $_DB;

    /**
     * The URL to assign to the form on the page rendered by
     * PageDecorationMiddleware
     */
    public string $FormAction;

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
        $session   = \TimePoint::singleton(
            new \SessionID(strval($_REQUEST['sessionID']))
        );
        $candid    = $session->getCandID();
        $candidate = \Candidate::singleton($candid);

        if ($candidate->getEntityType() == 'Scanner') {
            return ($user->hasPermission('imaging_browser_phantom_allsites')
                || $user->hasCenterPermission(
                    'imaging_browser_phantom_ownsite',
                    $session->getCenterID()
                ))
                && ($user->hasProject($session->getProject()->getId()));
        } elseif ($candidate->getEntityType() == 'Human') {
            return ($user->hasPermission('imaging_browser_view_allsites')
                || $user->hasCenterPermission(
                    'imaging_browser_view_site',
                    $session->getCenterID()
                ))
                && $user->hasProject($session->getProject()->getId());
        }
        return false;
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
        $this->_DB = $this->loris->getDatabaseConnection();

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

            $this->tpl_data['status_options']    = [
                ''     => '&nbsp;',
                'Pass' => 'Pass',
                'Fail' => 'Fail',
            ];
            $this->tpl_data['caveat_options']    = [
                ''      => '&nbsp;',
                'true'  => 'True',
                'false' => 'False',
            ];
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
        $args = ['SID' => $this->sessionID];
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
        $files = $this->_DB->pselect(
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

        $this->tpl_data['files'] = [];

        $timePoint = \TimePoint::singleton(
            new \SessionID($this->sessionID),
        );
        $factory   = \NDB_Factory::singleton();
        $baseurl   = $factory->settings()->getBaseURL();

        foreach ($files as $fileRow) {
            $FileObj = new \MRIFile(intval($fileRow['FileID']));
            if (empty($scannerID)) {
                $scannerID = $fileRow['ScannerID'];
                if (!empty($scannerID)) {
                    $query         = "SELECT CONCAT_WS(' ', Manufacturer, Model,".
                             " Serial_number) FROM mri_scanner WHERE ID=:ScanID";
                    $this->scanner = $this->_DB->pselectOne(
                        $query,
                        ['ScanID' => $scannerID]
                    );
                }
            }

            $FullFilename = $FileObj->getParameter('File') ?? '';
            $FileID       = intval($fileRow['FileID']);
            $Filename     = basename($FullFilename);
            $APIFile      = $baseurl . "/api/v0.0.3/candidates/"
                    . $timePoint->getCandID() . "/"
                    . $timePoint->getVisitLabel()
                    . "/images/"
                    . $Filename;

            $New        = ($FileObj->getParameter('QCFirstChangeTime') == '') ?
                                         1 : 0;
            $OutputType = $FileObj->getParameter('OutputType');
            $AcquisitionProtocol = $FileObj->getAcquisitionProtocol();
            $CoordinateSpace     = $FileObj->getParameter('CoordinateSpace');
            $AcquisitionDate     = $FileObj->getParameter('AcquisitionDate');
            $ProcDate            = $FileObj->getParameter(
                'processing:processing_date'
            );
            $FileInsertDate      = $FileObj->getParameter('InsertTime');
            $SeriesDescription   = $FileObj->getParameter('series_description');
            $SeriesNumber        = $FileObj->getParameter('series_number');
            $EchoTime            = number_format(
                (float)$FileObj->getParameter('echo_time') * 1000,
                2
            );
            $InversionTime       = number_format(
                (float)$FileObj->getParameter('inversion_time') * 1000,
                2
            );
            $RepetitionTime      = number_format(
                (float)$FileObj->getParameter('repetition_time') * 1000,
                2
            );
            $SliceThickness      = number_format(
                intval($FileObj->getParameter('slice_thickness')),
                2
            );
            $Time      = number_format(
                intval($FileObj->getParameter('time')),
                2
            );
            $ImageType = $FileObj->getParameter(
                'dicominfo:image_type'
            );
            $PhaseEncodingDirection = $FileObj->getParameter(
                'PhaseEncodingDirection'
            );
            $EchoNumber         = $FileObj->getParameter('echo_numbers');
            $Comment            = $FileObj->getParameter('Comment');
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
            $Xstep       = number_format(
                (float)($FileObj->getParameter('xstep')),
                2
            );
            $Ystep       = number_format(
                (float)($FileObj->getParameter('ystep')),
                2
            );
            $Zstep       = number_format(
                (float)($FileObj->getParameter('zstep')),
                2
            );
            $Selected    = $this->_getSelected(
                (int) $FileObj->getParameter('FileID')
            );
            $QCStatus    = $FileObj->getParameter('QCStatus');
            $QCDate      = $FileObj->getParameter('QCLastChangeTime');
            $SNR         = $FileObj->getParameter('SNR');
            $SeriesUID   = $FileObj->getParameter('SeriesUID');
            $XMLreport   = $FileObj->getParameter('processing:DTIPrepXmlReport');
            $XMLprotocol = $FileObj->getParameter('ProtocolFile');
            $NrrdFile    = $FileObj->getParameter('processing:nrrd_file');
            $NiiFile     = $FileObj->getParameter('check_nii_filename');
            $BvalFile    = $FileObj->getParameter('check_bval_filename');
            $BvecFile    = $FileObj->getParameter('check_bvec_filename');
            $JsonFile    = $FileObj->getParameter('bids_json_file');
            $OtherTimepoints = $this->_getFilesAcrossTimepoints(
                (int)$FileObj->getParameter('SessionID'),
                (int)$FileObj->getParameter('AcquisitionProtocolID')
            );

            $manualCaveatViolationsResolvedID
                = $this->_getManualCaveatViolationsResolvedID($FileID);
            $caveat = $manualCaveatViolationsResolvedID ? 1 : 0;
            $foundProtocolViolations = $this->_getProtocolViolations($FileID);
            $editableCaveat          = true;
            if ($foundProtocolViolations) {
                $caveat         = 1;
                $editableCaveat = false;
            }
            $file = [
                'FileID'                 => $FileID,
                'Filename'               => $Filename,
                'APIFile'                => $APIFile,
                'FullFilename'           => $FullFilename,
                'New'                    => $New,
                'OutputType'             => $OutputType,
                'AcquisitionProtocol'    => $AcquisitionProtocol,
                'CoordinateSpace'        => $CoordinateSpace,
                'AcquisitionDate'        => $AcquisitionDate,
                'ProcDate'               => $ProcDate,
                'FileInsertDate'         => $FileInsertDate,
                'SeriesDescription'      => $SeriesDescription,
                'SeriesNumber'           => $SeriesNumber,
                'SeriesUID'              => $SeriesUID,
                'EchoTime'               => $EchoTime,
                'InversionTime'          => $InversionTime,
                'RepetitionTime'         => $RepetitionTime,
                'SliceThickness'         => $SliceThickness,
                'Time'                   => $Time,
                'ImageType'              => $ImageType,
                'PhaseEncodingDirection' => $PhaseEncodingDirection,
                'EchoNumber'             => $EchoNumber,
                'Comment'                => $Comment,
                'ProcessingPipeline'     => $ProcessingPipeline,
                'TotalRejected'          => $TotalRejected,
                'SourceFile'             => $SourceFile,
                'Tool'                   => $Tool,
                'SlicewiseRejected'      => $SlicewiseRejected,
                'InterlaceRejected'      => $InterlaceRejected,
                'IntergradientRejected'  => $IntergradientRejected,
                'Xstep'                  => $Xstep,
                'Ystep'                  => $Ystep,
                'Zstep'                  => $Zstep,
                'Selected'               => $Selected,
                'QCStatus'               => $QCStatus,
                'QCDate'                 => $QCDate,
                'Caveat'                 => $caveat,
                'SNR'                    => $SNR,
                'XMLreport'              => $XMLreport,
                'XMLprotocol'            => $XMLprotocol,
                'NrrdFile'               => $NrrdFile,
                'NiiFile'                => $NiiFile,
                'BvalFile'               => $BvalFile,
                'BvecFile'               => $BvecFile,
                'JsonFile'               => $JsonFile,
                'OtherTimepoints'        => $OtherTimepoints,
                'EditableCaveat'         => $editableCaveat,
            ];

            $this->tpl_data['files'][] = $file;
        }
    }

    /**
     * Gets the ID of the record in table violations_resolved associated
     * to the manual caveat set on a given file.
     *
     * @param $fileID int the ID of the record in table files.
     *
     * @return ?int ID of the associated record in table violations_resolved or
     *              null if there is none.
     */
    function _getManualCaveatViolationsResolvedID(int $fileID): ?int
    {
        $query = "
            SELECT vr.ID
            FROM files f
            JOIN mri_violations_log mvl
              ON (mvl.MincFile = f.File)
            JOIN violations_resolved vr
              ON (    vr.ExtID     = mvl.LogID
                  AND vr.TypeTable = 'mri_violations_log'
                  AND vr.Resolved  = 'inserted_flag'
              )
            WHERE f.FileID =:fileID
            AND mvl.Header LIKE 'Manual Caveat Set by %';
        ";

        return $this->_DB->pselectOneInt($query, ['fileID' => $fileID]);
    }

    /**
     * Gets the ID of the record in table violations_resolved associated
     * to the manual caveat set on a given file.
     *
     * @param $fileID int the ID of the record in table files.
     *
     * @return ?array array of IDs of the associated records in table
     *              mri_violations_log or null if there is none.
     */
    function _getProtocolViolations(int $fileID): ?array
    {
        $query = "
            SELECT mvl.LogID
            FROM files f
            JOIN mri_violations_log mvl
              ON (mvl.MincFile = f.File)
            WHERE f.FileID =:fileID
            AND mvl.Header NOT LIKE 'Manual Caveat Set by %';
        ";

        return iterator_to_array($this->_DB->pselect($query, ['fileID' => $fileID]));
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
        $array     = [];
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
        $array = [];
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
                $updateSet = [
                    'QCStatus'         => $curStatus,
                    'QCLastChangeTime' => time(),
                ];

                // set first change time, if it's null only
                $params          = ['FID' => $curFileID];
                $firstChangeTime = $this->_DB->pselectOne(
                    "SELECT QCFirstChangeTime
                    FROM files_qcstatus
                    WHERE FileID=:FID",
                    $params
                );
                if (empty($firstChangeTime)) {
                    $updateSet['QCFirstChangeTime'] = time();
                }

                $QCExists    = $this->_DB->pselectOne(
                    "SELECT 'x'
                    FROM files_qcstatus
                    WHERE FileID=:FID",
                    $params
                );
                $updateSet   = \Utility::nullifyEmpty($updateSet, 'QCStatus');
                $updateWhere = [];
                if (!empty($QCExists)) {
                    $updateWhere['FileID'] = $curFileID;
                    $this->_DB->update(
                        'files_qcstatus',
                        $updateSet,
                        $updateWhere
                    );
                } else {
                    $file = new \MRIFile($curFileID);
                    $updateSet['SeriesUID'] = $file->getParameter(
                        'series_instance_uid'
                    );
                    $updateSet['PhaseEncodingDirection'] = $file->getParameter(
                        'PhaseEncodingDirection'
                    );
                    $updateSet['EchoTime']   = $file->getParameter('echo_time');
                    $updateSet['EchoNumber'] = $file->getParameter('echo_numbers');
                    $updateSet['FileID']     = $curFileID;
                    $this->_DB->insert("files_qcstatus", $updateSet);
                }
            }
        }
        if (is_array($values['caveat'])) {
            $user        = \User::singleton();
            $timePoint   =& \TimePoint::singleton(
                new \SessionID(strval($this->sessionID))
            );
            $candid      = $timePoint->getCandID();
            $visit_label = $timePoint->getData('Visit_label');

            foreach ($values['caveat'] as $curFileID => $curCaveat) {
                if ($curCaveat === '') {
                    $curCaveat = null;
                }
                $this->_DB->update(
                    "files",
                    ['Caveat' => $curCaveat],
                    ['FileID' => $curFileID]
                );

                $manualCaveatViolationsResolvedID
                    = $this->_getManualCaveatViolationsResolvedID($curFileID);
                // If Caveat was set to true and there is not already a manual
                // caveat for that scan, then the user wants to create one
                if ($curCaveat === '1' && !$manualCaveatViolationsResolvedID) {
                    //----------------------------------------------------------//
                    // Insert a record in mri_violations_log to indicate that   //
                    // there is an MRI violation for that scan. The Header      //
                    // (which is more the "type of violation" in this case...)  //
                    // will be 'Manual Caveat Set by <user_setting_the_caveat>' //
                    //----------------------------------------------------------//
                    $insertSet = [];
                    $file      = new \MRIFile($curFileID);
                    $insertSet['SeriesUID'] = $file->getParameter(
                        'series_instance_uid'
                    );
                    $insertSet['PhaseEncodingDirection'] = $file->getParameter(
                        'PhaseEncodingDirection'
                    );
                    $insertSet['EchoTime']    = $file->getParameter('echo_time');
                    $insertSet['EchoNumber']  = $file->getParameter('echo_numbers');
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

                    // The TimeRun column is really the time at which the
                    // Caveat flag was modified
                    $insertSet['TimeRun'] = date("Y-m-d H:i:s");
                    $timeRun = $insertSet['TimeRun'];

                    // We leave MriProtocolChecksGroupID to its default value (null)
                    // since this violation is not tied to any protocol checks group

                    $this->_DB->insert("mri_violations_log", $insertSet);
                    unset($insertSet);

                    //--------------------------------------------------------//
                    // Have MySQL compute the md5 hash for the violation that //
                    // was just inserted                                      //
                    //--------------------------------------------------------//
                    $mriViolationsLogID = $this->_DB->getLastInsertID();
                    $query = "
                         SELECT md5(
                             concat_WS(':',MincFile,PatientName,SeriesUID,TimeRun)
                         ) AS Hash
                         FROM  mri_violations_log
                         WHERE LogID =:logID
                    ";
                    $hash  = $this->_DB->pselectOne(
                        $query,
                        ['logID' => $mriViolationsLogID]
                    );

                    //-----------------------------------------------------//
                    // Insert a record in violations_resolved that marks   //
                    // the last record inserted in mri_violations_log as   //
                    // being resolved, with Resolve set to 'inserted_flag' //
                    //-----------------------------------------------------//
                    $this->_DB->insert(
                        'violations_resolved',
                        [
                            'hash'       => $hash,
                            'ExtID'      => $mriViolationsLogID,
                            'TypeTable'  => 'mri_violations_log',
                            'User'       => $user->getUsername(),
                            'ChangeDate' => $timeRun,
                            'Resolved'   => 'inserted_flag',
                        ]
                    );
                    $this->_DB->update(
                        'files',
                        ['Caveat' => 1],
                        ['FileID' => $curFileID],
                    );
                } elseif ($curCaveat === '0' && $manualCaveatViolationsResolvedID) {
                    $quotedViolationsResolvedID
                        = $this->_DB->quote("$manualCaveatViolationsResolvedID");
                    $query = "
                        DELETE FROM mri_violations_log
                        WHERE LogID = (
                            SELECT ExtID
                            FROM violations_resolved
                            WHERE ID = $quotedViolationsResolvedID
                            AND TypeTable = 'mri_violations_log'
                        )
                    ";
                    $this->_DB->run($query);

                    $this->_DB->delete(
                        'violations_resolved',
                        ['ID' => $manualCaveatViolationsResolvedID]
                    );

                    $quotedFileID = $this->_DB->quote($curFileID);
                    $query        = "
                        UPDATE files f
                        SET f.Caveat = IF(
                            EXISTS (
                                SELECT 1
                                FROM mri_violations_log mvl
                                JOIN parameter_type pt ON (pt.Name=mvl.Header)
                                JOIN parameter_file pf
                                  ON (pf.ParameterTypeID=pt.ParameterTypeID)
                                WHERE mvl.SeriesUID = f.SeriesUID
                                AND pf.FileID=f.FileID
                                AND pf.Value = mvl.Value
                            ),
                            1,
                            0
                        )
                        WHERE f.FileID=$quotedFileID
                    ";
                    $this->_DB->run($query);
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
                $params      = ['FID' => $curFileID];
                $updateWhere = ['FileID' => $curFileID];

                $file          = new \MRIFile($curFileID);
                $seriesUID     = $file->getParameter('series_instance_uid');
                $phase_enc_dir = $file->getParameter('PhaseEncodingDirection');
                $echo_time     = $file->getParameter('echo_time');
                $echo_number   = $file->getParameter('echo_numbers');

                if ($curSelected == 'Unselected') {
                    if ($this->_DB->pselectOne(
                        "SELECT COUNT(*)
                        FROM files_qcstatus
                        WHERE FileID=:FID ",
                        $params
                    ) > 0
                    ) {
                        $this->_DB->delete('files_qcstatus', $updateWhere);
                    }
                } else {
                    if ($this->_DB->pselectOne(
                        "SELECT COUNT(*)
                        FROM files_qcstatus
                        WHERE FileID=:FID ",
                        $params
                    ) > 0
                    ) {
                        $updateSet = [
                            'Selected'         => $curSelected,
                            'QCLastChangeTime' => time(),
                        ];
                        $updateSet = \Utility::nullifyEmpty($updateSet, 'Selected');
                        $this->_DB->update(
                            'files_qcstatus',
                            $updateSet,
                            $updateWhere
                        );
                    } else {

                        $insertSet = [
                            'FileID'                 => $curFileID,
                            'Selected'               => $curSelected,
                            'SeriesUID'              => $seriesUID,
                            'EchoTime'               => $echo_time,
                            'EchoNumber'             => $echo_number,
                            'PhaseEncodingDirection' => $phase_enc_dir,
                            'QCFirstChangeTime'      => time(),
                        ];
                        $insertSet = \Utility::nullifyEmpty($insertSet, 'Selected');
                        $this->_DB->insert('files_qcstatus', $insertSet);
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
            $params           = ['SID' => $this->sessionID];
            $old_visit_status = $this->_DB->pselectOne(
                "SELECT MRIQCStatus
                FROM session
                WHERE ID=:SID",
                $params
            );
            $old_pending_status = $this->_DB->pselectOne(
                "SELECT MRIQCPending
                FROM session
                WHERE ID=:SID",
                $params
            );
            $old_caveat_status  = $this->_DB->pselectOne(
                "SELECT MRICaveat
                FROM session
                WHERE ID=:SID",
                $params
            );

            $updateSet       = [
                'MRIQCPending'        => $_POST['visit_pending'],
                'MRIQCStatus'         => $_POST['visit_status'],
                'MRICaveat'           => $_POST['visit_caveat'],
                'MRIQCLastChangeTime' => date("Y-m-d H:i:s"),
            ];
            $firstChangeTime = $this->_DB->pselectOne(
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
            $this->_DB->update(
                'session',
                $updateSet,
                ['ID' => $this->sessionID]
            );
            // spool a message to the mri qc status rss channel
            if (($_POST['visit_status'] != $old_visit_status)
                || ($old_pending_status != $_POST['visit_pending'])
                || ($old_caveat_status != $_POST['visit_caveat'])
            ) {
                $timePoint   =& \TimePoint::singleton(
                    new \SessionID(strval($this->sessionID))
                );
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
     * @param int $initialFileID            the value of initialFileID
     * @param int $initialFileAcquisitionID the value of initialFileAcquisitionID
     *
     * @return string of FileIDs, comma separated
     */
    function _getFilesAcrossTimepoints($initialFileID, $initialFileAcquisitionID)
    {

        $selectResults = $this->_DB->pselect(
            "SELECT FileID FROM files ".
            "WHERE AcquisitionProtocolID =:initialFileAcquisitionID ".
            "AND SessionID in (SELECT s2.ID FROM session s1 RIGHT JOIN session s2 ".
            "ON s1.CandID = s2.CandID WHERE s1.ID =:initialFileID)",
            [
                'initialFileAcquisitionID' => $initialFileAcquisitionID,
                'initialFileID'            => $initialFileID,
            ]
        );

        $fileIDS = [];
        foreach ($selectResults as $selectResult) {
            $fileIDS[] = $selectResult['FileID'];
        }
        $fileIDString = implode(",", $fileIDS);
        return $fileIDString;
    }

    /**
     * Gets Selected status from files_qcstatus for a given FileID
     *
     * @param int $FileID the value of FileID
     *
     * @return ?string
     */
    function _getSelected($FileID): ?string
    {

        $selected = $this->_DB->pselectOne(
            "SELECT Selected FROM files_qcstatus ".
            "WHERE FileID =:FileID",
            ['FileID' => $FileID]
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
        $tpl_data            = [];
        $tpl_data['subject'] = $this->getSubjectData();

        if (!empty($_REQUEST['outputType'])) {
            $tpl_data['outputType'] = urldecode($_REQUEST['outputType']);
        }
        $config = \NDB_Config::singleton();
        if ($config->getSetting('useEDC') === 'true') {
            $tpl_data['useEDC'] = true;
        }

        $smarty = new \Smarty_NeuroDB('imaging_browser');

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
        $timePoint = \TimePoint::singleton(
            new \SessionID(strval($_REQUEST['sessionID']))
        );

        $subjectData = [];
        $subjectData['sessionID']   = $_REQUEST['sessionID'];
        $subjectData['CohortID']    = $timePoint->getCohortID();
        $subjectData['CohortTitle'] = $timePoint->getData('CohortTitle');
        $subjectData['visitLabel']  = $timePoint->getVisitLabel();
        $subjectData['visitNo']     = $timePoint->getVisitNo();
        $subjectData['site']        = $timePoint->getPSC();
        $qcstatus = $this->_DB->pselectRow(
            "SELECT MRIQCStatus, MRIQCPending, MRICaveat
            FROM session WHERE ID=:SID",
            ['SID' => $_REQUEST['sessionID']]
        );
        if (is_null($qcstatus)) {
            throw new \LorisException(
                'Could not find QC status information for the supplied '
                . 'session ID'
            );
        }
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
        $params     = [];
        $EntityType = $candidate->getEntityType();
        if ($EntityType == 'Scanner') {
            $ID = ":PPSCID";
            $params['PPSCID'] = $timePoint->getData('PSCID');
        } else {
            $ID = "LOWER(CONCAT(:PPSCID, '_', :PCandID, '_', :PVL, '%'))";
            $params['PPSCID']  = $candidate->getPSCID();
            $params['PCandID'] = $timePoint->getCandID();
            $params['PVL']     = $timePoint->getVisitLabel();
        }
        $tarchiveIDs = $this->_DB->pselect(
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
        $controlPanel = new Imaging_Session_ControlPanel(
            new \SessionID($_REQUEST['sessionID'])
        );
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
            [
                $baseurl . "/imaging_browser/js/jiv_and_imaging_browser.js",
                $baseurl . "/imaging_browser/js/ImagePanel.js",
            ]
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
