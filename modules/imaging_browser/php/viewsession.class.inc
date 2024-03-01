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
    public $skipTemplate = true;

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
            $this->tpl_data['sessionID'] = $this->sessionID;
            $user = \User::singleton();
            if ($this->_hasAccess($user) && isset($_POST['save_changes'])) {
                $this->_updateStatus($_POST);
                $this->_updateSelected();
                $this->_updateVisitStatus();
            }

            $this->tpl_data['showFloatJIV'] = true;

            $file = $this->_DB->pselectOne(
                "SELECT File FROM files f
                JOIN session s
                ON (s.ID=f.SessionID)
                WHERE s.ID=:sid AND FileType='obj'",
                ['sid' => $this->sessionID]
            );
            if (!empty($file)) {
                $this->tpl_data['show3DViewer'] = true;
            }

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
            $updateSet          = [
                'MRIQCPending'        => $_POST['visit_pending'],
                'MRIQCStatus'         => $_POST['visit_status'],
                'MRICaveat'           => $_POST['visit_caveat'],
                'MRIQCLastChangeTime' => date("Y-m-d H:i:s"),
            ];
            $firstChangeTime    = $this->_DB->pselectOne(
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
                $baseurl . "/imaging_browser/js/Session.js",
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
