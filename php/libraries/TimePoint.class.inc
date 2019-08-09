<?php declare(strict_types=1);
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
    /* NOTE If these are private variables then they should probably be
     * declared and scoped as such. var is equivalent to public.
     */
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
    static function &singleton(int $sessionID)
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
    function select(int $sessionID): void
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
                intval($row['SubprojectID'])
            );
            $title = $subprojectSettings['title'] ?? '';
            $this->_timePointInfo['SubprojectTitle'] = $title;
        } else {
            // return error when 0 rows to prevent creation of an empty object
            throw new LorisException(
                "Failed to retrieve data for timepoint $sessionID"
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
     * @param \Candidate  $candidate      The Candidate to create this timepoint for
     * @param integer     $SubprojectID   The subprojectID of the new timepoint
     * @param string|null $nextVisitLabel The visit label of the timepoint
     *                                    being created. If null, consecutive V1, V2,
     *                                    etc will be created.
     * @param \Site       $psc            The center of the timepoint
     *
     * @throws DatabaseException
     *
     * @return void
     */
    static function createNew(
        \Candidate $candidate,
        int $SubprojectID,
        ?string $nextVisitLabel,
        \Site $psc
    ): void {

        // insert into session set CandID=$candID,
        // SubprojectID=$SubprojectID, VisitNo=nextVisitNumber(),
        // UserID=$State->getUsername(), etc...  NO Date_* are
        // specified here!
        $factory = NDB_Factory::singleton();
        $db      = $factory->database();

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

        $visitNo = $candidate->getNextVisitNo();
        // setup the insert data array
        $VisitLabel = $nextVisitLabel;
        if ($VisitLabel === null) {
            $VisitLabel = "V$visitNo";
        }

        $insertData = array(
                       'CandID'          => $candidate->getCandID(),
                       'SubprojectID'    => $SubprojectID,
                       'VisitNo'         => $visitNo,
                       'Visit_label'     => $VisitLabel,
                       'CenterID'        => $psc->getCenterID(),
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
    static function isValidVisitLabel(
        int $candid,
        int $subprojectID,
        string $visitLabel
    ): void {

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
        foreach (\Utility::associativeToNumericArray($visitLabelSettings)
            as $visitLabelSetting) {
            if ($visitLabelSetting['@']['subprojectID'] == $subprojectID) {
                $items = \Utility::associativeToNumericArray(
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
     * @param string|null $var The variable to retrieve about this timepoint.
     *
     * @return mixed The value of $var for this timepoint, or all values.
     */
    function getData(?string $var = null)
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
     * $newData should be in the form: array($key => $value).
     *
     * This should usually not be used directly but instead use one of the set*
     * methods below. However, there are cases where it may be easier to directly
     * use setData.
     *
     * @param array $newData Key-value pair(s) of the field(s) to change and its
     *                              new value(s).
     *
     * @return bool
     *
     * @throws DatabaseException
     * @throws LorisException
     */
    public function setData(array $newData): bool
    {
        /* $newData should be in the form: array($key => $value). Count should
         * equal 1 if this is the case.
         */
        if (empty($newData)) {
            throw new LorisException(
                'TimePoint::setData() cannot be called with an empty array!'
            );
        }

        \Database::singleton()->update(
            'session',
            $newData,
            array(
             'ID' => $this->getData('SessionID'),
            )
        );
        // this select updates the timepoint object
        $this->select(intval($this->getData('SessionID')));
        return true;
    }

    /**
     * Returns the CandID for the candidate who had this visit.
     *
     * @return integer (6 digit) CandID for this timepoint.
     */
    function getCandID(): int
    {
        /* _timePointInfo contains information that comes from the database
         * which returns values in string format. Intval is used here to
         * ensure we return a numerical ID instead of its string representation.
         */
        return intval($this->_timePointInfo["CandID"]);
    }

    /**
     * Returns the SessionID for this visit.
     *
     * @return integer The ID for this session.
     */
    function getSessionID(): int
    {
        /* _timePointInfo contains information that comes from the database
         * which returns values in string format. Intval is used here to
         * ensure we return a numerical ID instead of its string representation.
         */
        return intval($this->_timePointInfo["SessionID"]);
    }

    /**
     * Return the string representing the center for this visit.
     *
     * @return string The center of this visit
     */
    function getPSC(): string
    {
        return $this->_timePointInfo["PSC"];
    }

    /**
     * Returns the CenterID for this visit.
     *
     * @return integer the ID representing the PSC for this visit
     */
    function getCenterID(): int
    {
        /* _timePointInfo contains information that comes from the database
         * which returns values in string format. Intval is used here to
         * ensure we return a numerical ID instead of its string representation.
         */
        return intval($this->_timePointInfo['CenterID']);
    }

    /**
     * Return the visit number for this timepoint.
     *
     * @return integer the number of this visit.
     */
    function getVisitNo(): int
    {
        /* _timePointInfo contains information that comes from the database
         * which returns values in string format. Intval is used here to
         * ensure we return a numerical ID instead of its string representation.
         */
        return intval($this->_timePointInfo["VisitNo"]);
    }

    /**
     * Returns the visit label of this timepoint.
     *
     * @return string the visit label
     */
    function getVisitLabel(): string
    {
        return $this->_timePointInfo["Visit_label"];
    }

    /**
     * Returns the SubprojectID of this timepoint.
     *
     * @return int|null the SubprojectID, or null
     */
    function getSubprojectID(): ?int
    {
        /* _timePointInfo contains information that comes from the database
         * which returns values in string format. Intval is used here to
         * ensure we return a numerical ID instead of its string representation.
         */
        if (is_numeric($this->_timePointInfo["SubprojectID"])) {
            return intval($this->_timePointInfo["SubprojectID"]);
        }
        return null;
    }

    /**
     * Gets this timepoint's screening status.
     *
     * @return string 'Pass', 'Failure', 'Withdrawal', or 'In Progress'
     */
    function getScreeningStatus(): string
    {
        return $this->_timePointInfo["Screening"];
    }

    /**
     * Gets the visit status of this timepoint.
     *
     * @return ?string 'Pass', 'Failure', 'Withdrawal', or 'In Progress'
     */
    function getVisitStatus(): ?string
    {
        return $this->_timePointInfo["Visit"];
    }

    /**
     * Return the approval status of this timepoint.
     *
     * @return string|null 'In Progress', 'Pass' or 'Failure'
     */
    function getApprovalStatus(): ?string
    {
        return $this->_timePointInfo["Approval"];
    }

    /**
     * Returns the date of screening for this session.
     *
     * @return string|null of form "YYYY-MM-DD" (or null)
     */
    function getDateOfScreening(): ?string
    {
        return $this->_timePointInfo["Date_screening"];
    }

    /**
     * Returns the date of visit for this session.
     *
     * @return string|null of form "YYYY-MM-DD" (or null)
     */
    function getDateOfVisit(): ?string
    {
        return $this->_timePointInfo["Date_visit"];
    }

    /**
     * Returns the date of approval of this session.
     *
     * @return string|null of form "YYYY-MM-DD" (or null)
     */
    function getDateOfApproval(): ?string
    {
        return $this->_timePointInfo["Date_approval"];
    }

    /**
     * Returns whether this timepoint was submitted to DCC
     *
     * @return true if submitted
     */
    function isSubmitted(): bool
    {
        return $this->_timePointInfo["Submitted"] == 'Y';
    }

    /**
     * Returns whether this timepoint is active or not.
     *
     * @return boolean true if active.
     */
    function isActive(): bool
    {
        return $this->_timePointInfo["Active"] == 'Y';
    }


    /**
     * Gets whether or not a scan was done for this TimePoint
     *
     * @return string 'Y' if a scan was done 'N' if not.
     */
    function getScanDone(): string
    {
        return $this->_timePointInfo["Scan_done"];
    }

    /**
     * Returns BVLQC status (Y-hardcopy QC, N-no QC, V-visual QC)
     *
     * @return string|null
     */
    function getBVLQCStatus(): ?string
    {
        return $this->_timePointInfo['BVLQCStatus'];
    }

    /**
     * Returns BVLQC exclusion type
     *
     * @return string|null
     */
    function getBVLQCType(): ?string
    {
        return $this->_timePointInfo['BVLQCType'];
    }

    /**
     * Returns BVLQC exclusion status
     *
     * @return string
     */
    function getBVLQCExclusion(): string
    {
        return $this->_timePointInfo['BVLQCExclusion'];
    }

    /**
     * Returns the list of BVLQC exclusion statuses
     *
     * @return array
     */
    function getBVLQCExclusionStatusList(): array
    {
        return $this->bvlQcExclusionStatuses;
    }

    /**
     * Returns the current stage of the selected timepoint
     *
     * @return string the current stage
     */
    function getCurrentStage(): string
    {
        return $this->_timePointInfo["Current_stage"];
    }

    /**
     * Gets the current stage status
     *
     * @return string|null status of current stage
     */
    function getCurrentStatus(): ?string
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
     * @return string|null "YYYY-MM-DD"
     */
    function getCurrentDate(): ?string
    {
        $getDateMethod = "getDateOf" . $this->getCurrentStage();
        if (method_exists($this, $getDateMethod)) {
            return $this->$getDateMethod();
        }
        return null;
    }

    /**
     * Defines the next study stage
     *
     * @return string|null study stage title
     */
    function getNextStage(): ?string
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
    function isStudyStageDynamic(string $stage): bool
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
    function isNextStageDynamic(): bool
    {
        return $this->isStudyStageDynamic($this->getNextStage());
    }

    /**
     * Derives what stage the TimePoint should be set to and updates
     * the session table.
     *
     * @return void
     */
    function setCurrentStage(): void
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
     * Starts a stage.
     *
     * @param string $stage The stage which is being started.
     *                      valid options are those in session.Current_stage
     *                      enum
     *
     * @return void (but as a side-effect modifies database.)
     */
    function startStage(string $stage): void
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
    function setBVLQCType(string $type): void
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
    function setBVLQCStatus(string $status): void
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
    function setBVLQCExclusion(string $status): bool
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
     * @return bool
     */
    function isStartable(): bool
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
     * @return string|null date YYYY-MM-DD
     */
    function getEffectiveDateOfBirth(): ?string
    {
        $candidate = \Candidate::singleton($this->getCandID());
        if (!is_null($this->getSubprojectID())) {
            $settings = \NDB_Config::singleton()
                ->getSubprojectSettings($this->getSubprojectID());
            if ($settings['options']['useEDC'] == "true") {
                return $candidate->getCandidateEDC();
            }
        }

        return $candidate->getCandidateDoB();
    }

    /**
     * Gets the Images of that session.
     *
     * @param \User $user The requesting user
     *
     * @return \LORIS\Data\Models\ImageDTO[] A traversable of ImageDTO
     */
    public function getImages(\User $user): array
    {
        $provisioner = new \LORIS\Data\Provisioners\TimepointImagesRowProvisioner(
            $this
        );
        $traversable = (new \LORIS\Data\Table())
            ->withDataFrom($provisioner)
            ->getRows($user);

        return iterator_to_array($traversable);
    }

    /**
     * Gets the first Image of that session matching a given filename.
     *
     * @param \User  $user     The requesting user
     * @param string $filename The requested filename
     *
     * @throws \NotFound
     * @return \LORIS\Image
     */
    public function getImageByFilename(\User $user, string $filename): \LORIS\Image
    {
        $filtered = array_filter(
            $this->getImages($user),
            function ($dto) use ($filename) {
                return $dto->getFilename() == $filename;
            }
        );

        if (empty($filtered)) {
            throw new \NotFound($filename . ' not found.');
        }

        // Take the first corresponding file.
        $imagedto = array_pop($filtered);

        return new \LORIS\Image($imagedto->getFileid());
    }

    /**
     * Gets the DicomTars of that session.
     *
     * @param \User $user The requesting user
     *
     * @return \LORIS\data\Models\DicomTarDTO[] A traversable of DicomTarDTO
     */
    public function getDicomTars(\User $user): array
    {
        $provisioner = new \LORIS\api\provisioners\VisitDicomsRowProvisioner($this);
        $traversable = (new \LORIS\Data\Table())
            ->withDataFrom($provisioner)
            ->getRows($user);

        return iterator_to_array($traversable);
    }

    /**
     * Gets the first DicomTar of that session matching a given filename.
     *
     * @param string $tarname The requested filename
     *
     * @throws \NotFound
     * @return \LORIS\Data\Models\DicomTarDTO
     */
    public function getDicomTarByFilename(
        string $tarname
    ): \LORIS\Data\Models\DicomTarDTO {
        $db  = \NDB_Factory::singleton()->database();
        $row = $db->pselectRow(
            'SELECT
               TarchiveID as tarchiveid
             FROM
               tarchive
             WHERE
               tarchive.SessionID = :v_sessionid AND
               tarchive.ArchiveLocation LIKE :v_basename',
            array(
             'v_sessionid' => $this->getSessionID(),
             'v_basename'  => '%' . $tarname,
            )
        );

        if (empty($row)) {
            throw new \NotFound($tarname . ' not found.');
        }

        return (new \LORIS\DicomTar(intval($row['tarchiveid'])))->asDTO();
    }

    /**
     * Adds a file to the mri_upload table for that session
     *
     * @param \User        $user        The user inserting the file.
     * @param \SplFileInfo $file        The file on the file system.
     * @param string       $patientname The patient name
     * @param bool         $isphantom   True if it's a phantom file
     *
     * @return int The UploadID from the mri_upload table sequence.
     */
    public function addMRIUpload(
        \User $user,
        \SplFileInfo $file,
        string $patientname,
        bool $isphantom
    ): int {

        $values = array(
                   'UploadedBy'     => $user->getUsername(),
                   'UploadDate'     => date('Y-m-d H:i:s'),
                   'UploadLocation' => $file->getPathname(),
                   'SessionID'      => $this->getSessionID(),
                   'PatientName'    => $patientname,
                   'IsPhantom'      => ($isphantom ? 'Y' : 'N'),
                  );

        $db = \NDB_Factory::singleton()->database();
        $db->insert('mri_upload', $values);
        return (int) $db->getLastInsertId();
    }

    /**
     * This retreives all MRIUpload with the given filename for that session.
     *
     * @param \User  $user     The requesting user.
     * @param string $filename The mri_upload file's basename.
     *
     * @return \LORIS\Data\Models\MRIUploadDTO[]
     */
    public function getMRIUploadsByFilename(\User $user, string $filename): array
    {
        $provisioner = new \LORIS\Data\Provisioners\TimepointMRIUploadsProvisioner(
            $this,
            $filename
        );
        $traversable = (new \LORIS\Data\Table())
            ->withDataFrom($provisioner)
            ->getRows($user);

        return iterator_to_array($traversable);
    }

    /**
     * Accessor for this timepoint imaging QC status.
     *
     * @return \LORIS\TimePointImagingQC
     */
    public function getImagingQC(): \LORIS\TimePointImagingQC
    {
        $db  = \NDB_Factory::singleton()->database();
        $row = $db->pselectRow(
            '
             SELECT
               MRIQCStatus as qcstatus,
               MRIQCPending as ispending,
               MRICaveat as hascaveat
             FROM
               session
             WHERE
               ID = :v_sessionid
            ',
            array('v_sessionid' => $this->getSessionID())
        );

        return new \LORIS\TimePointImagingQC(
            $row['qcstatus'] ?? null,
            $row['ispending'] ?? null,
            $row['hascaveat'] ?? null
        );
    }

    /**
     * Gets the instrument names associated to this timepoint
     *
     * The DISTINCT keyword is used because DDE instruments would meke
     * duplicates.
     *
     * @return array A list of test_name
     */
    public function getInstrumentNames(): array
    {
        $db     = \NDB_Factory::singleton()->database();
        $result = $db->pselectCol(
            '
             SELECT DISTINCT
               Test_name as shortname
             FROM
               flag
             WHERE
               SessionID = :v_sessionid
            ',
            array('v_sessionid' => $this->getSessionID())
        );
        return $result;
    }
}

