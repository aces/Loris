<?php
/**
 * This file contains a TimePoint class which represent's a single session
 * for a single candidate in Loris.
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Loris
 * @author   Alex Zijdenbos <zijdenbos@example.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */

/**
 * The Loris TimePoint class
 *
 * @category Main
 * @package  Loris
 * @author   Alex Zijdenbos <zijdenbos@example.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class TimePoint
{
    var $_timePointInfo;

    var $_stageOptions = array(
                          null,
                          'Not Started',
                          'Screening',
                          'Visit',
                          'Approval',
                          'Subject',
                          'Recycling Bin',
                         );

    var $_dynamicStageOptions = array(
                                 'Screening',
                                 'Visit',
                                 'Approval',
                                );

    var $_statusOptions = array(
                           null,
                           'Pass',
                           'Failure',
                           'Withdrawal',
                           'In Progress',
                          );

    var $bvlQcTypes = array(
                       null,
                       'Visual',
                       'Hardcopy',
                      );

    var $bvlQcStatuses = array(
                          null,
                          'Complete',
                         );

    var $bvlQcExclusionStatuses = array(
                                   null,
                                   'Excluded',
                                   'Not Excluded',
                                  );


    /**
     * Returns an object representing this Timepoint, and ensures that only
     * one is ever created per Session.
     *
     * @param integer $sessionID The ID of the TimePoint to retrieve from the
     *                           database
     *
     * @return TimePoint object representing $sessionID
     */
    static function &singleton($sessionID)
    {
        // instantiate new TimePoint object
        static $timePointList = array();
        if (!isset($timePointList[$sessionID])) {
            try {
                $timePointList[$sessionID] = new TimePoint();

                $timePointList[$sessionID]->select($sessionID);
            } catch (Exception $e) {
                // Since there was a problem with this $sessionID, don't store
                // it in the static list but then keep propagating the error..
                unset($timePointList[$sessionID]);
                throw $e;
            }
        }

        return $timePointList[$sessionID];
    }


    /**
     * Loads the data from the given sessionID into the current TimePoint class.
     *
     * @param integer $sessionID The $sessionID to load.
     *
     * @return void (but side-effect loads current object.)
     */
    function select($sessionID)
    {
        $config         =& NDB_Config::singleton();
        $useScreening   = $config->getSetting('useScreening');
        $screeningIndex = array_search('Screening', $this->_stageOptions);
        if ($useScreening != 'true' && $screeningIndex !== false) {
            unset($this->_stageOptions[$screeningIndex]);
            $this->_stageOptions = array_values($this->_stageOptions);
        }

        // make a local reference to the Database object
        $db =& Database::singleton();

        // get user data from database
        $query = "SELECT s.ID AS SessionID, s.CandID, p.Name AS PSC, s.CenterID,
                         s.VisitNo, s.Visit_label, s.SubprojectID, s.Submitted,
                         s.Current_stage, s.Screening, s.Date_screening, s.Visit,
                         s.Date_visit, s.Approval, s.Date_approval, s.Active,
                         s.registeredBy, s.UserID, u.Real_name, s.Hardcopy_request,
                         s.BVLQCStatus, s.BVLQCType, s.BVLQCExclusion, s.Scan_done
                    FROM session AS s
                        LEFT JOIN psc AS p USING (CenterID)
                        LEFT JOIN users AS u on (s.registeredBy=u.UserID)
                    WHERE s.ID = :SID AND s.Active = 'Y'";
        $row   = $db->pselectRow($query, array('SID' => $sessionID));

        // store user data in object property
        if (is_array($row) && count($row) > 0) {
            $this->_timePointInfo = $row;
            $subprojectSettings   = $config->getSubprojectSettings(
                $row['SubprojectID']
            );
            $this->_timePointInfo['SubprojectTitle'] = $subprojectSettings['title'];
        } else {
            // return error when 0 rows to prevent creation of an empty object
            throw new LorisException(
                'Failed to retrieve data for timepoint '
                . htmlspecialchars($sessionID)
            );
        }
        // New feature, older databases might not have the table created,
        // so require a config option to be set
        if ($config->getSetting("SupplementalSessionStatus") == 'true') {

            $query = "SELECT ss.Name, ss.Value
                        FROM session_status ss
                            JOIN session s ON (s.ID=ss.SessionID)
                        WHERE s.ID=:sessionID AND s.Active='Y'";

            $statuses = $db->pselect($query, array(":sessionID" => $sessionID));
            foreach ($statuses as $row) {
                if (!isset($this->_timePointInfo['status'])) {
                    $this->_timePointInfo['status'] = array();
                }
                $this->_timePointInfo['status'][$row['Name']] = $row['Value'];
            }
            $this->_timePointInfo['WindowInfo'] = $db->pSelectRow(
                "SELECT DATEDIFF(s.Date_visit, c.DoB) as AgeDays,
                        DATEDIFF(s.Date_visit, c.DoB) BETWEEN
                            w.OptimumMinDays
                            AND w.OptimumMaxDays as Optimum,
                        (DATEDIFF(s.Date_visit, c.DoB) BETWEEN
                            w.WindowMinDays AND w.WindowMaxDays
                        ) as Permitted
                    FROM session s
                        JOIN candidate c USING (CandID)
                        JOIN Visit_Windows w ON (
                            LOWER(w.Visit_label)=LOWER(s.Visit_label)
                        )
                    WHERE s.ID=:sessionID",
                array(":sessionID" => $sessionID)
            );

        }

    }


    /**
     * Registers a new timepoint into the session table
     *
     * @param integer $candID         6 digit CandID having a timepoint created.
     * @param integer $SubprojectID   The subprojectID of the new timepoint
     * @param string  $nextVisitLabel The visit label of the timepoint being created
     * @param string  $psc            The center of the timepoint
     *
     * @return void
     */
    static function createNew($candID, $SubprojectID,
        $nextVisitLabel = null, $psc = null
    ) {

        // insert into session set CandID=$candID,
        // SubprojectID=$SubprojectID, VisitNo=nextVisitNumber(),
        // UserID=$State->getUsername(), etc...  NO Date_* are
        // specified here!
        $factory = NDB_Factory::singleton();
        $db      = $factory->database();

        // select the candidate data
        $query = "SELECT c.CenterID,
                         IFNULL(max(s.VisitNo)+1, 1) AS nextVisitNo
                    FROM candidate AS c
                        LEFT OUTER JOIN session AS s USING (CandID)
                    WHERE c.CandID=:CaID AND (s.Active='Y' OR s.Active is null)
                    GROUP BY c.CandID";
        $row   = $db->pselectRow($query, array('CaID' => $candID));

        // if this is a web hit (thus state exists)
        if (isset($_SESSION) && is_object($_SESSION['State'])) {
            // get username from State
            $userID = $_SESSION['State']->getUsername();
        } else {
            // not a web hit, so use the unix username from the environment
            $userID = getenv('USER');
        }

        // generate today's date for the Date registered field
        $today = date("Y-m-d");

        // setup the insert data array
        $VisitLabel = $nextVisitLabel == null
            ? 'V' . $row['nextVisitNo']
            : $nextVisitLabel;
        $centerID   = $psc == null
        ? $row['CenterID']
        : $psc;
        $insertData = array(
                       'CandID'          => $candID,
                       'SubprojectID'    => $SubprojectID,
                       'VisitNo'         => $row['nextVisitNo'],
                       'Visit_label'     => $VisitLabel,
                       'CenterID'        => $centerID,
                       'Current_stage'   => 'Not Started',
                       'Submitted'       => 'N',
                       'registeredBy'    => $userID,
                       'UserID'          => $userID,
                       'Date_registered' => $today,
                       'Date_active'     => $today,
                      );

        // insert the data
        $db->insert('session', $insertData);
    }

    /**
     * Validates if a given visit_label follows the study's config settings
     * and if that same visit label can be created for the given candidate.
     *
     * @param integer $candid       The candidate identifier
     * @param integer $subprojectID The subprojectID
     * @param string  $visitLabel   The visit label
     *
     * @throws LorisException
     *
     * @return void
     */
    static function isValidVisitLabel($candid, $subprojectID, $visitLabel)
    {
        // This can happen if the user quickly clicks "Create Time Point" before the
        // page has loaded and the Visit Label dropdown hasn't been selected yet.
        // The page will create "V1" when this is the case without this check.
        if (empty($visitLabel)) {
            throw new \LorisException(
                'A visit label is required.'
            );
        }

        $config =& \NDB_Config::singleton();
        $visitLabelSettings = $config->getSetting('visitLabel');
        $isValid            = false;
        foreach (\Utility::toArray($visitLabelSettings) as $visitLabelSetting) {
            if ($visitLabelSetting['@']['subprojectID'] == $subprojectID) {
                $items = \Utility::toArray(
                    $visitLabelSetting['labelSet']['item']
                );
                foreach ($items as $item) {
                    if ($item['@']['value'] == $visitLabel) {
                        $isValid = true;
                        break;
                    }
                }
            }
        }
        if (!$isValid) {
            throw new \LorisException(
                'This visit label is not valid for this subproject.'
            );
        }

        $candidate =& \Candidate::singleton($candid);

        $timePointArray = $candidate->getListOfVisitLabels();

        //If the visitLabel is already in use then let the user pick another
        foreach ($timePointArray AS $used_label) {
            if (strcasecmp($visitLabel, $used_label) == 0) {
                throw new \LorisException(
                    'This visit label is not unique.'
                );
            }
        }
    }

    /**
     * Gets a piece of data regarding this TimePoint. Usually, you should
     * use one of the get* methods below, but in cases where it does not
     * exist you can use this function directly.
     *
     * @param string $var The variable to retrieve about this timepoint.
     *
     * @return string The value of $var for this timepoint.
     */
    function getData($var = null)
    {
        if (is_null($var)) {
            return $this->_timePointInfo;
        } elseif (isset($this->_timePointInfo[$var])) {

            return $this->_timePointInfo[$var];
        }
        return null;
    }

    /**
     * Sets a piece of data for this timepoint and saves it to the session table.
     *
     * This should usually not be used directly but instead use one of the set*
     * methods below. However, there are cases where it may be easier to directly
     * use setData.
     *
     * @param string $var   The variable to set for this timepoint.
     * @param string $value The value to set $var to.
     *
     * @return void (side-effect modifies session table.)
     */
    function setData($var, $value = null)
    {
        if (!is_array($var)) {
            $setData = array($var => $value);
        } else {
            $setData = $var;
        }

        //$this->_timePointInfo = array_merge($this->_timePointInfo, $setData);

        $db =& Database::singleton();
        $db->update('session', $setData, array('ID' => $this->getData('SessionID')));
        $this->select($this->getData('SessionID'));
    }

    /**
     * Returns the CandID for the candidate who had this visit.
     *
     * @return integer (6 digit) CandID for this timepoint.
     */
    function getCandID()
    {
        return $this->_timePointInfo["CandID"];
    }

    /**
     * Returns the SessionID for this visit.
     *
     * @return integer The ID for this session.
     */
    function getSessionID()
    {
        return $this->_timePointInfo["SessionID"];
    }

    /**
     * Return the string representing the center for this visit.
     *
     * @return string The center of this visit
     */
    function getPSC()
    {
        return $this->_timePointInfo["PSC"];
    }

    /**
     * Returns the CenterID for this visit.
     *
     * @return integer the ID representing the PSC for this visit
     */
    function getCenterID()
    {
        return $this->_timePointInfo['CenterID'];
    }

    /**
     * Return the visit number for this timepoint.
     *
     * @return integer the number of this visit.
     */
    function getVisitNo()
    {
        return $this->_timePointInfo["VisitNo"];
    }

    /**
     * Returns the visit label of this timepoint.
     *
     * @return string the visit label
     */
    function getVisitLabel()
    {
        return $this->_timePointInfo["Visit_label"];
    }

    /**
     * Returns the SubprojectID of this timepoint.
     *
     * @return integer the SubprojectID
     */
    function getSubprojectID()
    {
        return $this->_timePointInfo["SubprojectID"];
    }

    /**
     * Gets this timepoint's screening status.
     *
     * @return string 'Pass', 'Failure', 'Withdrawal', or 'In Progress'
     */
    function getScreeningStatus()
    {
        return $this->_timePointInfo["Screening"];
    }

    /**
     * Gets the visit status of this timepoint.
     *
     * @return string 'Pass', 'Failure', 'Withdrawal', or 'In Progress'
     */
    function getVisitStatus()
    {
        return $this->_timePointInfo["Visit"];
    }

    /**
     * Return the approval status of this timepoint.
     *
     * @return string 'In Progress', 'Pass' or 'Failure'
     */
    function getApprovalStatus()
    {
        return $this->_timePointInfo["Approval"];
    }

    /**
     * Returns the date of screening for this session.
     *
     * @return string of form "YYYY-MM-DD" (or null)
     */
    function getDateOfScreening()
    {
        return $this->_timePointInfo["Date_screening"];
    }

    /**
     * Returns the date of visit for this session.
     *
     * @return string of form "YYYY-MM-DD" (or null)
     */
    function getDateOfVisit()
    {
        return $this->_timePointInfo["Date_visit"];
    }

    /**
     * Returns the date of approval of this session.
     *
     * @return string of form "YYYY-MM-DD" (or null)
     */
    function getDateOfApproval()
    {
        return $this->_timePointInfo["Date_approval"];
    }

    /**
     * Returns whether this timepoint was submitted to DCC
     *
     * @return true if submitted
     */
    function isSubmitted()
    {
        return $this->_timePointInfo["Submitted"] == 'Y';
    }

    /**
     * Returns whether this timepoint is active or not.
     *
     * @return boolean true if active.
     */
    function isActive()
    {
        return $this->_timePointInfo["Active"] == 'Y';
    }


    /**
     * Gets whether or not a scan was done for this TimePoint
     *
     * @return string 'Y' if a scan was done 'N' if not.
     */
    function getScanDone()
    {
        return $this->_timePointInfo["Scan_done"];
    }

    /**
     * Returns BVLQC status (Y-hardcopy QC, N-no QC, V-visual QC)
     *
     * @return string
     */
    function getBVLQCStatus()
    {
        return $this->_timePointInfo['BVLQCStatus'];
    }

    /**
     * Returns BVLQC exclusion type
     *
     * @return string
     */
    function getBVLQCType()
    {
        return $this->_timePointInfo['BVLQCType'];
    }

    /**
     * Returns BVLQC exclusion status
     *
     * @return string
     */
    function getBVLQCExclusion()
    {
        return $this->_timePointInfo['BVLQCExclusion'];
    }

    /**
     * Returns the list of BVLQC exclusion statuses
     *
     * @return string
     */
    function getBVLQCExclusionStatusList()
    {
        return $this->bvlQcExclusionStatuses;
    }

    /**
     * Returns the current stage of the selected timepoint
     *
     * @return string the current stage
     */
    function getCurrentStage()
    {
        return $this->_timePointInfo["Current_stage"];
    }

    /**
     * Gets the current stage status
     *
     * @return ?string status of current stage or null
     */
    function getCurrentStatus()
    {
        $method = 'get' . $this->getCurrentStage() . 'Status';
        if (method_exists($this, $method)) {
            return $this->$method();
        } else {
            return null;
        }
    }

    /**
     * Gets the date of the current stage.
     *
     * @return string of the form "YYYY-MM-DD"
     */
    function getCurrentDate()
    {
        $getDateMethod = "getDateOf" . $this->getCurrentStage();
        if (method_exists($this, $getDateMethod)) {
            return $this->$getDateMethod();
        } else {
            return false;
        }
    }

    /**
     * Defines the next study stage
     *
     * @return string study stage title
     */
    function getNextStage()
    {
        if ($this->getData('Current_stage') == 'Approval'
            && $this->getData('Approval') != 'Pass'
        ) {

            // if the time point is sent to DCC and the outcome is not Pass
            // then the next stage is Recycling Bin
            return 'Recycling Bin';

        }
        // otherwise just get the next stage in the sequence
        $index = array_search(
            $this->getData('Current_stage'),
            $this->_stageOptions
        );

        $nextStageIndex = $index + 1;

        return $this->_stageOptions[$nextStageIndex];
    }

    /**
     * Defines a stage as dynamic - that can be assigned a BVL
     * battery, its status updated, and sent to DCC
     *
     * @param string $stage A study stage, from the field session.Current_stage
     *
     * @return bool
     */
    function isStudyStageDynamic($stage)
    {
        // if not $stage is passed, evaluate the current stage
        if (empty($stage)) {
            throw new Exception("Study Stage Not Specified");
        } else {
            return in_array($stage, $this->_dynamicStageOptions);
        }
    }

    /**
     * Determine whether the current stage is static or dynamic.
     *
     * @return boolean true if stage is dynamic.
     */
    function isCurrentStageDynamic()
    {
        $isStageDynamic = $this->isStudyStageDynamic($this->getCurrentStage());
        return $isStageDynamic;
    }

    /**
     * Determine whether the next stage is dynamic or static
     *
     * @return boolean true if stage is dynamic.
     */
    function isNextStageDynamic()
    {
        return $this->isStudyStageDynamic($this->getNextStage());
    }

    /**
     * Derives what stage the TimePoint should be set to and updates
     * the session table.
     *
     * @return void
     */
    function setCurrentStage()
    {
        $db =& Database::singleton();

        // this class does not handle Subject & Recycling Bin stage at the moment
        if (in_array($this->getCurrentStage(), array('Subject', 'Recycling Bin'))) {
            return;
        }

        // if sent to DCC then it either Approval, Subject or Recycling Bin
        if ($this->isSubmitted() && $this->getApprovalStatus() != 'NULL') {
            if ($this->getApprovalStatus() == 'Failure') {
                $newCurrentStage = 'Recycling Bin';
                // delete from conflicts_unresolved if marked Recycling Bin
                $commentIDs = $db->pselect(
                    "SELECT CommentID FROM flag WHERE SessionID=:SID",
                    array('SID' => $this->getSessionID())
                );
                foreach ($commentIDs as $commentID) {
                    $deleteWhere1 = array('CommentId1' => $commentID);
                    $deleteWhere2 = array('CommentId2' => $commentID);
                    $db->delete('conflicts_unresolved', $deleteWhere1);
                    $db->delete('conflicts_unresolved', $deleteWhere2);
                }
            } else {
                // in all other cases
                $newCurrentStage = 'Approval';
            }
        } else {
            // of not sent to DCC get the latest stage
            if ($this->getVisitStatus() != null) {
                $newCurrentStage = 'Visit';
            } elseif ($this->getScreeningStatus() != null) {
                $newCurrentStage = 'Screening';
            } else {
                $newCurrentStage = 'Not Started';
            }
        }

        // generate today's date in MySQL format
        $today = date("Y-m-d");

        // update session table
        $update_columns = array(
                           "Date_stage_change" => $today,
                           'Current_stage'     => $newCurrentStage,
                          );

        $db->update(
            'session',
            $update_columns,
            array('ID' => $this->getSessionID())
        );

        // reload TimePoint object
        $this->select($this->getSessionID());
    }

    /**
     * THIS FUNCTION DOES NOTHING. IT SHOULD BE REMOVED.
     *
     * @deprecated
     *
     * @return void
     */
    function startNextStage()
    {
        // figure out what the next stage should be
        // start that stage
        // set the date for the new stage
        // set SubprojectID if applicable
        // set scan done if applicable
    }

    /**
     * Starts a stage.
     *
     * @param string $stage The stage which is being started.
     *                      valid options are those in session.Current_stage
     *                      enum
     *
     * @return void (but as a side-effect modifies database.)
     */
    function startStage($stage)
    {
        $setArray = array(
                     'Current_stage'     => $stage,
                     'Date_stage_change' => date('Y-m-d'),
                    );

        if (in_array($stage, $this->_dynamicStageOptions)
            && $this->getData($stage) == null
        ) {
            $setArray[$stage] = 'In Progress';
        }

        if ($setArray['Current_stage'] == 'Approval') {
            $setArray['Date_approval'] = date('Y-m-d');
        }

        $this->setData($setArray);
    }

    /**
     * Sends Time Point to DCC
     * also allow "unsend", i.e. sets session.Submit='N' in case it ever
     * becomes necessary
     *
     * @param string $type see session.QCd field options, what is passed
     *                     here is the label from the bvlQcTypes array
     *
     * @return void
     */
    function setBVLQCType($type)
    {
        $db =& Database::singleton();

        if (!in_array($type, $this->bvlQcTypes)) {
            throw new Exception("You need to specify a valid BVL QC Type");
        }

        $setArray = array('BVLQCType' => $type);

        // update session table
        $db->update(
            'session',
            $setArray,
            array('ID' => $this->getSessionID())
        );

        // reload TimePoint object
        $this->select($this->getSessionID());
    }

    /**
     * Set BVL QC Status.
     *
     * @param string $status The status to set the BVL QC to.
     *                       Valid options are Complete or null.
     *
     * @return void
     */
    function setBVLQCStatus($status)
    {
        $db =& Database::singleton();

        if (!in_array($status, $this->bvlQcStatuses)) {
            throw new Exception("You need to specify a valid BVL QC Type");
        }

        // get the current bvlqc type
        $qcType = $this->getBVLQCType();

        // can't set the status to Complete unless the type is set
        if ($status == 'Complete' && empty($qcType)) {
            throw new Exception("Cannot complete QC until the type is defined");
        }

        $setArray = array('BVLQCStatus' => $status);

        // update session table
        $db->update(
            'session',
            $setArray,
            array('ID' => $this->getSessionID())
        );

        // reload TimePoint object
        $this->select($this->getSessionID());
    }

    /**
     * Sets the BVL QC Exclusionary status for this timepoint.
     *
     * @param string $status The status to set this TimePoint to.
     *                       Valid options are "Excluded" or "Not Excluded"
     *
     * @return true on success
     */
    function setBVLQCExclusion($status)
    {
        $db =& Database::singleton();

        // check the status
        if (!in_array($status, $this->bvlQcExclusionStatuses)) {
            throw new Exception(
                "TimePoint::setBVLQCExclusion: "
                . "You need to specify a valid BVL QC Exclusion Status"
            );
        }

        // fields to update
        $setArray = array('BVLQCExclusion' => $status);

        // update session table
        $db->update(
            'session',
            $setArray,
            array('ID' => $this->getSessionID())
        );

        // reload TimePoint object
        $this->select($this->getSessionID());

        return true;
    }

    /**
     * Determines whether the next stage for the timepoint is startable.
     *
     * Rules:  1. User must have permission.
     *         2. If the stage to be started is a testing stage, then there can
     *            be no other timepoints of the same subproject that are in a
     *            testing stage (screening or visit).
     *         3. If the stage to be started is not a testing stage, the the
     *            current stage status cannot be "In Progress".
     *
     * @return boolean
     */
    function isStartable()
    {
        $currentStage = $this->getData('Current_stage');

        // if we have not yet started, and at least one timepoint is in
        // screening or visit, do not allow the user to start another timepoint
        if ($currentStage == 'Not Started') {
            return true;
        } elseif ($currentStage == 'Screening'
            && in_array($this->getData('Screening'), array('Pass', 'Failure'))
        ) {
            return true;
        }
        return false;
    }

    /**
     * Returns either EDC or DOB depending on the settings of the subproject
     * that this timepoint belongs to.
     *
     * @return string of the date in YYYY-MM-DD
     */
    function getEffectiveDateOfBirth()
    {
        $config    = NDB_Config::singleton();
        $candidate = Candidate::singleton($this->getCandID());
        $settings  = $config->getSubprojectSettings($this->getSubprojectID());
        if ($settings['options']['useEDC'] == "true") {
            return $candidate->getCandidateEDC();
        }

        return $candidate->getCandidateDoB();
    }

    /**
     * Gets the Images of that session
     *
     * @param \User $user The requesting user
     *
     * @return \LORIS\ImageDTO[] A traversable of \LORIS\ImageDTO
     */
    public function getImages(\User $user): array
    {
        $provisioner = new \LORIS\api\VisitImagesRowProvisioner($this);
        $traversable = (new \LORIS\Data\Table())
            ->withDataFrom($provisioner)
            ->getRows($user);

        return iterator_to_array($traversable);
    }

    /**
     * Gets the DicomTar of that session
     *
     * @param \User $user The requesting user
     *
     * @return \LORIS\DicomTarDTO[] A traversable of \LORIS\DicomTarDTO
     */
    public function getDicomTars(\User $user): array
    {
        $provisioner = new \LORIS\api\VisitDicomsRowProvisioner($this);
        $traversable = (new \LORIS\Data\Table())
            ->withDataFrom($provisioner)
            ->getRows($user);

        return iterator_to_array($traversable);
    }

}
?>
