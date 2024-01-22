<?php
/**
 * This is legacy code that should be rewritten, but is currently used - Dave
 *
 * Original file document comments below:
 *
 * missing code in update thread to move to answered if PSC, and to preserve
 * comment in all cases
 *
 * missing QC status and in .php file the req.actio value {$required
 *   action }/per thread to automatically make the proper form field.
 *
 * missing error display row in each form (already working in cose/activate
 * forms)
 *
 * missing general error display and per thread(form)
 *
 * need error trapping to prevent screen display in case of all failures
 *
 * PHP Version 5
 *
 * @category Behavioural
 * @package  Loris
 * @author   Alex Zijdenbos <zijdenbos@example.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
use \Loris\StudyEntities\Candidate\CandID;

/**
 * A NDB_BVL_Feedback object wraps access to behavioural feedback related
 * tables.
 *
 * @category Behavioural
 * @package  Loris
 * @author   Alex Zijdenbos <zijdenbos@example.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class NDB_BVL_Feedback
{
    // contains info necessary to structure the object
    var $_feedbackObjectInfo = [];

    // contains full candidate profile/timepoint/instrument info
    var $_feedbackCandidateProfileInfo = [];

    // set of status options
    var $_feedbackStatusOptions = [
        'opened',
        'answered',
        'closed',
        'comment',
    ];

    var $_username ='';

    var $_feedbackLevel ='';

    /**
     * Static function to return a feedback object. Only one will ever be
     * instantiated. Note that ANY of $candID, $sessionID, or $commentID
     * can be passed but not necessarily all of them, depending on which
     * page is receiving feedback.
     *
     * @param string     $username  The currently logged in user (why?)
     * @param ?CandID    $candID    The 6 digit CandID
     * @param ?SessionID $sessionID The session ID with feedback
     * @param ?string    $commentID The commentID receiving feedback.
     *
     * @return NDB_BVL_Feedback object
     */
    static function &singleton(
        $username,
        ?CandID $candID=null,
        ?SessionID $sessionID=null,
        $commentID=null
    ) {
        // at least one of the args have to be passed
        if (empty($candID) && empty($sessionID) && empty($commentID)) {
            throw new Exception(
                "You need to pass at least one of the following when creating "
                . " the Feedback Object: CandID, SessionID, or CommentID"
            );
        }

        static $feedbackList = [];

        $objectName = md5(
            sprintf(
                "c%ss%si%s",
                $candID,
                $sessionID ?? '',
                $commentID ?? ''
            )
        );

        if (!isset($feedbackList[$objectName])) {
            try {
                $feedbackList[$objectName] = new NDB_BVL_Feedback();
                $feedbackList[$objectName]->setup(
                    $username,
                    $candID,
                    $sessionID,
                    $commentID
                );
            } catch (Exception $e) {
                unset($feedbackList[$objectName]);
                throw new Exception(
                    "Could not instantiate feedback object",
                    0,
                    $e
                );
            }
        }

        return $feedbackList[$objectName];
    }

    /**
     * Sets up a newly instantiated feedback thread object
     *
     * @param string     $username  The name of the currently logged in user.
     *                              FIXME (why is this here?)
     * @param ?CandID    $candID    The CandID for this feedback thread.
     * @param ?SessionID $sessionID The sessionID for this feedback thread.
     * @param ?string    $commentID The commentID for this feedback thread.
     *
     * @return void
     */
    function setup(
        string $username,
        ?CandID $candID=null,
        ?SessionID $sessionID=null,
        $commentID=null
    ) {

        if (!empty($commentID)) {
            $this->_feedbackObjectInfo['CommentID'] = $commentID;
            $this->_feedbackLevel = 'instrument';
        } elseif (!empty($sessionID)) {
            $this->_feedbackObjectInfo['SessionID'] = $sessionID;
            $this->_feedbackLevel = 'visit';
        } elseif (!empty($candID)) {
            $this->_feedbackObjectInfo['CandID'] = $candID;
            $this->_feedbackLevel = 'profile';
        } else {
            throw new Exception(
                "You need to pass at least one of the following to setup the "
                . "Feedback Object: CandID, SessionID, or CommentID"
            );
        }

        $this->_username = $username;

        // get CandID (and SessionID)
        $this->_setCandidateProfileInfo();
    }

    /**
     * Retrieves candidate profile info for the feedback object
     * When you pass SessionID and CommentID, you'll need additional profile info
     * to be able to complete various queries.
     *
     * @return void
     */
    function _setCandidateProfileInfo(): void
    {
        $db = \NDB_Factory::singleton()->database();

        // SELECT section
        $query = "SELECT c.CandID";
        if (!empty($this->_feedbackObjectInfo['CommentID'])) {
            $query .= ", SessionID";
        }

        $query  .= " FROM candidate as c";
        $qparams = [];

        if (!empty($this->_feedbackObjectInfo['CommentID'])) {
            $query .= " JOIN session as s
                          ON (c.CandID=s.CandID)
                        JOIN flag as f
                          ON (f.SessionID=s.ID)
                        WHERE f.CommentID = :ComID";

            $qparams['ComID'] = $this->_feedbackObjectInfo['CommentID'];
        } elseif (!empty($this->_feedbackObjectInfo['SessionID'])) {
            $query .= " JOIN session as s
                          ON (s.CandID=c.CandID)
                        WHERE s.ID = :SID";

            $qparams['SID'] = $this->_feedbackObjectInfo['SessionID'];
        } elseif (!empty($this->_feedbackObjectInfo['CandID'])) {
            $query          .= " WHERE c.CandID = :CaID";
            $qparams['CaID'] = (string) $this->_feedbackObjectInfo['CandID'];
        } else {
            throw new InvalidArgumentException(
                "You need to pass at least one of the following to setup "
                . "the Feedback Object: CandID, SessionID, or CommentID"
            );
        }
        $query .= " LIMIT 1";

        $result = $db->pselect($query, $qparams);
        if (!is_array($result) || count($result) == 0) {
            throw new LorisException(
                "Error, unable to select data for the feedback object"
            );
        }

        $this->_feedbackCandidateProfileInfo['CandID'] = $result[0]['CandID'];
        if (isset($result[0]['SessionID'])
            || isset($this->_feedbackObjectInfo['SessionID'])
        ) {
            $this->_feedbackCandidateProfileInfo['SessionID']
                = isset($result[0]['SessionID']) ?
                  new \SessionID($result[0]['SessionID']) :
                  $this->_feedbackObjectInfo['SessionID'];
        }
    }

    /**
     * Get feedback level of currently instantiated thread object
     *
     * @return string feedback_level (either profile, visit, or instrument)
     */
    function getFeedbackLevel(): string
    {
        return $this->_feedbackLevel;
    }

    /**
     * Returns an array of feedback types array format: [Type][Name, Label]
     *
     * @return array
     */
    static public function getFeedbackTypes(): array
    {

        $query = "SELECT Feedback_type as Type, Name, Description
            FROM feedback_bvl_type";

        $result = \NDB_Factory::singleton()->database()
            ->pselect($query, []);

        $list = [];
        foreach ($result as $record) {
            $list[$record['Type']] = [
                'Type'  => $record['Type'],
                'Name'  => $record['Name'],
                'Label' => $record['Description'],
            ];
        }
        return $list;
    }


    /**
     * Get feedback type id given the feedback type name
     *
     * @param string $name feedback type name
     *
     * @return ?int feedback type id
     */
    public function getFeedbackTypeIdByName($name): ?int
    {
        $factory = \NDB_Factory::singleton();
        $db      = $factory->database();

        $query = "SELECT  `Feedback_type`
                    FROM  `feedback_bvl_type`
                    WHERE  `Name` =  :name ";

        return $db->pselectOneInt($query, [':name' => $name]);
    }

    /**
     * Create new feedback type
     *
     * @param string  $name        feedback type name
     * @param ?string $description feedback type description
     *
     * @return int feedback type id
     * @throws DatabaseException
     * @throws LorisException
     */
    public function createFeedbackType(
        string $name,
        ?string $description = null
    ): int {
        if (empty($name) || strlen($name) > 100 ) {
            throw new InvalidArgumentException(
                "Invalid feedback type name: name must not be empty and must "
                . "not exceed 100 characters"
            );
        }

        if (empty($description)) {
            $description = null;
        }

        $db = \NDB_Factory::singleton()->database();

        $values = [
            'Name'        => $name,
            'Description' => $description,
        ];
        $db->insert("feedback_bvl_type", $values);
        return intval($db->getLastInsertId());
    }

    /**
     * Returns a type of the thread identified by the FeedbackID
     *
     * @param integer $feedbackID ID of the thread whose type we want to get
     *
     * @return ?string feedback type of the thread
     */
    function getThreadType($feedbackID): ?string
    {

        $db = \NDB_Factory::singleton()->database();

        $query = "SELECT Name FROM feedback_bvl_thread
                  JOIN feedback_bvl_type ON
                  feedback_bvl_type.Feedback_type = feedback_bvl_thread.Feedback_type
                  WHERE feedback_bvl_thread.FeedbackID = :FID";

        return $db->pselectOne($query, ['FID' => $feedbackID]);
    }

    /**
     * Return the hex code of the status color defined in config.xml
     *
     * @param string $status The status for which we want to get the colour
     *
     * @return string color hex code (format #xxxxxx)
     */
    static function getThreadColor($status)
    {
        if (empty($status)) {
            return '';
        }

        $smarty = new Smarty_NeuroDB;
        // What does this do?
        $smarty->ConfigLoad('default.conf', 'bvlqc');
        return $smarty->getConfigVars($status);
    }

    /**
     * Get the status of the given thread.
     *
     * @param integer $feedbackID The feedback thread ID to get the status of
     *
     * @return ?string The current status.
     */
    function getThreadStatus($feedbackID): ?string
    {
        $db = \NDB_Factory::singleton()->database();

        $query = "SELECT Status FROM feedback_bvl_thread WHERE FeedbackID = :FID";

        return $db->pselectOne($query, ['FID' => $feedbackID]);
    }

    /**
     * This function returns the greatest type of active feedback for the
     * candidate/timepoint/instrument
     *
     * @param boolean $select_inactive_threads If true returns inactive
     *                                         threads, otherwise only returns
     *                                         active threads
     *
     * @return ?string the higest-order status of an active thread
     */
    function getMaxThreadStatus($select_inactive_threads): ?string
    {
        $db = \NDB_Factory::singleton()->database();

        $query   = "SELECT MAX(Status) FROM feedback_bvl_thread WHERE";
        $qparams = [];
        if (!empty($this->_feedbackObjectInfo['CandID'])) {
            $query         .= " CandID = :CID";
            $qparams['CID'] = $this->_feedbackObjectInfo['CandID'];
        }
        if (!empty($this->_feedbackObjectInfo['SessionID'])) {
            $query         .= " SessionID = :SID";
            $qparams['SID'] = $this->_feedbackObjectInfo['SessionID'];
        }
        if (!empty($this->_feedbackObjectInfo['CommentID'])) {
            $query           .= " CommentID = :ComID";
            $qparams['ComID'] = $this->_feedbackObjectInfo['CommentID'];
        }
        if (empty($select_inactive_threads)) {
            $query .= " AND Active = 'Y'";
        }

        $query .= " ORDER BY Status ASC";
        $result = $db->pselectOne($query, $qparams);

        if (!empty($result)) {
            return $result;
        }
        return null;
    }

    /**
     * Returns the thread count for candidate/timepoint/instrument
     *
     * @return int thread count
     */
    function getThreadCount(): int
    {
        $query   = "SELECT COUNT(*)
            FROM feedback_bvl_thread
            WHERE Active ='Y' AND Public = 'Y' AND Status <> 'closed'";
        $qparams = [];
        if (!empty($this->_feedbackObjectInfo['CommentID'])) {
            $query           .= " AND CommentID = :ComID";
            $qparams['ComID'] = $this->_feedbackObjectInfo['CommentID'];
            $queryBy          = " CommentID";
        } elseif (!empty($this->_feedbackObjectInfo['SessionID'])) {
            $query         .= " AND SessionID = :SID";
            $qparams['SID'] = $this->_feedbackObjectInfo['SessionID'];
            $queryBy        = " SessionID";
        } elseif (!empty($this->_feedbackObjectInfo['CandID'])) {
            $query           .= " AND CandID = :CanID";
            $qparams['CanID'] = $this->_feedbackObjectInfo['CandID'];
            $queryBy          = " CandID";
        } elseif (!empty($this->_feedbackObjectInfo['FieldName'])) {
            $query           .=     " AND FieldName = :FName";
            $qparams['FName'] = $this->_feedbackObjectInfo['FieldName'];
            $queryBy          = " FieldName";
        } else {
            throw new Exception("no CandID, SessionID, CommentID provided");
        }
        $query .= " GROUP BY $queryBy";

        return \NDB_Factory::singleton()
            ->database()
            ->pselectOneInt($query, $qparams) ?? 0;
    }

    /**
     * Returns the bvl feedback threads count for a candidate/timepoint/instrument
     *
     * @return array array of threads
     */
    function getSummaryOfThreads()
    {
        $db = \NDB_Factory::singleton()->database();

        // get User object
        $user =& User::singleton($this->_username);
        $hasReadPermission = $user->hasPermission('access_all_profiles');

        $query = "SELECT c.CandID as CandID,
                    c.PSCID as PSCID,
                    c.Ethnicity,
                    c.Sex,
                    s.ID as SessionID,
                    s.Visit_label as Visit,
                    ft.Feedback_level as QC_Class,
                    COUNT(ft.FeedbackID) as No_Threads";
        if (empty($this->_feedbackObjectInfo['CandID'])) {
            $query .= ", f.Test_name as Instrument, ft.CommentID";
        }
        $query  .= " FROM candidate as c
                        JOIN feedback_bvl_thread as ft ON (c.CandID=ft.CandID)
                        LEFT JOIN session as s ON (s.ID = ft.SessionID)";
        $qparams = [];
        if (empty($this->_feedbackObjectInfo['CandID'])) {
            $query .= " LEFT JOIN flag as f ON (ft.CommentID = f.CommentID)";
        }
        $query .= " WHERE ft.Active ='Y'";

        $query .= " AND Public = 'Y' AND Status <> 'closed'";
        if (!empty($this->_feedbackObjectInfo['CandID'])) {
            $query            .= " AND ft.CandID = :CaID";
            $qparams['CaID']   = $this->_feedbackObjectInfo['CandID'];
            $candidate         = Candidate::singleton(new CandID($qparams['CaID']));
            $hasReadPermission = (
                $hasReadPermission ||
                $candidate->isAccessibleBy($user)
            );
        }
        if (!empty($this->_feedbackObjectInfo['SessionID'])) {
            $query            .= " AND ft.SessionID = :SID";
            $qparams['SID']    = $this->_feedbackObjectInfo['SessionID'];
            $timepoint         = TimePoint::singleton(
                new SessionID($qparams['SID'])
            );
            $hasReadPermission = (
                $hasReadPermission ||
                $timepoint->isAccessibleBy($user)
            );
        }
        if (!empty($this->_feedbackObjectInfo['CommentID'])) {
            $query           .= " AND ft.CommentID = :ComID";
            $qparams['ComID'] = $this->_feedbackCandidateProfileInfo['CommentID'];
        }

        if (!$hasReadPermission) {
            $query            .= " AND FIND_IN_SET(s.CenterID, :CentID)";
            $qparams['CentID'] = implode(',', $user->getCenterIDs());
        }

        $query .= " GROUP BY ft.CandID, ft.Feedback_level, ft.SessionID";
        if (empty($this->_feedbackObjectInfo['CandID'])) {
            $query .= ", ft.CommentID";
        }
        $query .= " ORDER BY ft.CandID, ft.Feedback_level";

        $result = $db->pselect($query, $qparams);

        return $result;
    }

    /**
     * Returns the list of feedback threads
     *
     * @return array
     */
    function getThreadList()
    {
        $db = \NDB_Factory::singleton()->database();

        // create user object
        $user =& User::singleton($this->_username);
        $hasReadPermission = $user->hasPermission('access_all_profiles');

        $query   = "SELECT c.CandID as CandID, c.PSCID as PSCID";
        $qparams = [];
        if (!empty($this->_feedbackObjectInfo['SessionID'])
            || !empty($this->_feedbackObjectInfo['CommentID'])
        ) {
            $query .= ", s.VisitNo as Visit, s.CohortID, s.ID as SessionID";
        }

        $query .= ", ft.FeedbackID,
                     ft.Feedback_level as QCClass,
                     ftp.Description as Type,
                     ftp.Feedback_type as TypeID,
                     ft.Status as QCStatus,
                     ft.Active as Active,
                     ft.Public as Public,
                     ft.FieldName,
                     ft.UserID as User,
                     ft.Date_taken as Date,
                     DATE_FORMAT(ft.Testdate, '%Y-%m-%d') as Modified";
        if (!empty($this->_feedbackObjectInfo['CommentID'])) {
            $query .= ", f.Test_name as Instrument, f.CommentID";
        }

        $query .= " FROM candidate as c
                     JOIN feedback_bvl_thread as ft
                         ON (c.CandID=ft.CandID)
                     LEFT JOIN session as s
                         ON (s.ID = ft.SessionID)
                     JOIN feedback_bvl_type as ftp
                         ON (ftp.Feedback_type=ft.Feedback_type)";
        if (!empty($this->_feedbackObjectInfo['CommentID'])) {
            $query .= ", flag as f";
        }

        // FIXME: This clause is kept here so that the ANDs below don't
        // cause SQL syntax errors on any code paths.
        // This would make more sense to put in an array and then
        // call "join($arrayname, ", ") at the end to construct the string.
        $query .= " WHERE ftp.Feedback_type = ft.Feedback_type";

        if (!empty($this->_feedbackObjectInfo['CommentID'])) {
            $query           .= " AND ft.SessionID = :SID";
            $query           .= " AND ft.CommentID = :ComID
                                  AND ft.CommentID = f.CommentID";
            $qparams['SID']   = $this->_feedbackCandidateProfileInfo['SessionID'];
            $qparams['ComID'] = $this->_feedbackObjectInfo['CommentID'];
        } elseif (!empty($this->_feedbackObjectInfo['SessionID'])) {
            $query            .= " AND ft.SessionID = :SID AND ft.CommentID is null";
            $qparams['SID']    = $this->_feedbackObjectInfo['SessionID'];
            $timepoint         = TimePoint::singleton(
                new SessionID($qparams['SID'])
            );
            $hasReadPermission = (
                $hasReadPermission ||
                $timepoint->isAccessibleBy($user)
            );
        } elseif (!empty($this->_feedbackObjectInfo['CandID'])) {
            $query            .= " AND ft.CandID = :CaID
                                 AND ft.SessionID IS NULL
                                 AND ft.CommentID IS NULL";
            $qparams['CaID']   = $this->_feedbackObjectInfo['CandID'];
            $candidate         = Candidate::singleton(new CandID($qparams['CaID']));
            $hasReadPermission = (
                $hasReadPermission ||
                $candidate->isAccessibleBy($user)
            );
        } else {
            throw new Exception(
                "You need to pass at least one of the following to retrieve the"
                . " list of thread: CandID, SessionID, or CommentID"
            );
        }

        // DCC users should be able to see THEIR OWN inactive threads,
        // other users should see only active threads
        if ($hasReadPermission) {
            $query .= " AND (ft.Active='Y' OR
                (ft.Active='N' AND ft.UserID=:Username)
            )";
            $qparams['Username'] = $this->_username;
        } else {
            $query            .= " AND ft.Active ='Y'
                                   AND FIND_IN_SET(s.CenterID, :CentID)";
            $qparams['CentID'] = implode(',', $user->getCenterIDs());
        }

        $query .= " ORDER BY ft.CandID,
                             ft.Feedback_level,
                             ft.Status,
                             ft.Testdate DESC";

            $result = $db->pselect($query, $qparams);

        return $result;
    }

    /**
     * Returns the list of entries for the thread
     *
     * @param string $feedbackID feedback_bvl_thread.FeedbackID field
     *
     * @return array
     */
    static function getThreadEntries($feedbackID)
    {
        $db = \NDB_Factory::singleton()->database();

        //select the entries (details) for the thread
        $query
            = "SELECT
                  fe.ID as EntryID,
                  fe.FeedbackID,
                  fe.Comment,
                  fe.UserID as UserID,
                  DATE_FORMAT(fe.Testdate, '%Y-%m-%d %H:%i:%s') as Date
             FROM feedback_bvl_thread as ft,
                  feedback_bvl_entry as fe,
                  feedback_bvl_type as ftp
             WHERE ft.FeedbackID = :FID
                   AND ft.FeedbackID = fe.FeedbackID
                   AND ft.Feedback_type = ftp.Feedback_type
             ORDER BY ft.FeedbackID, fe.Testdate ASC";

        $result = $db->pselect($query, ['FID' => $feedbackID]);

        return $result;
    }

    /**
     * Creates a new behavioural feedback thread
     *
     * @param string  $level     Feedback level
     * @param integer $type      Feedback type ID
     * @param string  $comment   The content of the thread
     * @param string  $public    Y or N depending on if the thread is public
     * @param string  $fieldname Optional fieldname for the thread to be
     *                           attached to
     *
     * @return array
     * As we need the values in this array in dynamic front-end calls.
     *
     * @throws DatabaseException
     * @throws Exception
     */
    function createThread($level, $type, $comment, $public=null,$fieldname=null)
    {
        $DB = \NDB_Factory::singleton()->database();

        // public threads are inactive by default
        if ($public == 'Y') {
            $status = 'opened'; // default status
        } elseif ($public == 'N') {
            $status = 'comment';
        } else {
            throw new Exception(
                "Please select a 'Required Action?'"
                . " for the new feedback you want to create"
            );
        }
        $today = date("Y-m-d");

        // disabling post new feedback option, activate all threads
        $active = 'Y';

        // create SET array for the INSERT into the feedback_bvl_thread table
        $setArray = [
            'FeedbackID'    => null,
            'Feedback_type' => $type,
            'Public'        => $public,
            'Status'        => $status,
            'Active'        => $active,
            'Date_taken'    => $today,
            'UserID'        => $this->_username,
        ];
        if ($level == 'instrument' || $this->_feedbackLevel=='instrument') {
            $feedbackInfo =& $this->_feedbackCandidateProfileInfo;

            $setArray = array_merge(
                $setArray,
                [
                    "CommentID"      => $this->_feedbackObjectInfo['CommentID'],
                    "SessionID"      => $feedbackInfo['SessionID'],
                    "CandID"         => $feedbackInfo['CandID'],
                    "Feedback_level" => "instrument",
                    "FieldName"      => $fieldname,
                ]
            );

        } elseif ($level == 'visit' || $this->_feedbackLevel=='visit') {
            $candID   = $this->_feedbackCandidateProfileInfo['CandID'];
            $setArray = array_merge(
                $setArray,
                [
                    "SessionID"      => $this->_feedbackObjectInfo['SessionID'],
                    "CandID"         => $candID,
                    "Feedback_level" => "visit",
                ]
            );
        } elseif ($level == 'profile' || $this->_feedbackLevel=='profile') {
            $setArray = array_merge(
                $setArray,
                [
                    "CandID"         => $this->_feedbackObjectInfo['CandID'],
                    "Feedback_level" => "profile",
                ]
            );
        } else {
            throw new Exception(
                "NDB_BVL_Feedback::closeThread: Unsupported Feedback Level\n"
            );
        }

        $DB->insert('feedback_bvl_thread', $setArray);

        // get the FeedbackID for the new thread
        $feedbackID = intval($DB->getLastInsertId());

        // INSERT entry for the the thread into the feedback_bvl_thread
        $this->createEntry($feedbackID, $comment, $this->_username);

        $newEntryValues = [];
        $newEntryValues["feedbackID"] = $feedbackID;
        $newEntryValues["comment"]    = $comment;
        if ($fieldname != null) {
            $newEntryValues["fieldname"] = $fieldname;
        } else {
            $newEntryValues["fieldname"] = '';
        }
        $newEntryValues["user"] = $this->_username;
        $newEntryValues["date"] = $today;
        $newEntryValues["type"] = $this->getThreadType($feedbackID);
        //These new entries are returned to be used mostly dynamic rendering of
        //new threads on the front-end
        return $newEntryValues;

    }

    /**
     * Creates a new entry under a thread, adds a record to the
     * feedback_bvl_entry table
     *
     * @param integer $feedbackID The threadID to hold the entry being created
     * @param string  $comment    The comment to add to the entry.
     * @param string  $username   The username of the entry author.
     *
     * @return array
     */
    function createEntry($feedbackID, $comment, $username): array
    {
        $db = \NDB_Factory::singleton()->database();

        // create SET array for the INSERT
        $setArray = [
            'FeedbackID' => $feedbackID,
            'Comment'    => $comment,
            'UserID'     => $username,
        ];

        $db->insert('feedback_bvl_entry', $setArray);

        // Returning the set array so the data can be returned as JSON to the GUI.
        return $setArray;
    }

    /**
     * Creates a new thread entry and (if allowed) updates the selected
     * thread's type/status/public
     *
     * @param integer  $feedbackID Thread ID being updated
     * @param string   $comment    The comment to update the thread to
     * @param ?integer $type       The typeID to update Feedback_type to
     * @param string   $public     Y or N to update thread's public status to
     * @param string   $status     Status of the thread (options from
     *                             feedback_bvl_thread.Status)
     * @param string   $fieldname  The optional fieldname that the thread is in
     *                             reference to.
     *
     * @return void
     */
    function updateThread(
        $feedbackID,
        $comment,
        $type=null,
        $public='',
        $status='',
        $fieldname =''
    ) {
        $db = \NDB_Factory::singleton()->database();

        // create the new entry - every update need to be follow up with a comment
        // FIXME: I don't think the third parameter is correct, but I'm not sure
        // what it's supposed to be, and I'm not sure if this code is even used
        // at all.
        $this->createEntry($feedbackID, $comment, '');

        // force private threads to status='comment'
        if ($public=='N') {
            $status = 'comment';
        } else {
            if ($public=='Y' && empty($status)) {
                $status = 'opened';
            }
        }
        // needed to avoid php complaints
        $setArray = [];
        if (!empty($status)) {
            $setArray = array_merge($setArray, ["Status" => $status]);
        }
        if (!empty($type)) {
            $setArray = array_merge($setArray, ["Feedback_type" => $type]);
        }
        if (!empty($public)) {
            $setArray = array_merge($setArray, ["Public" => $public]);
        }
        if (!empty($fieldname)) {
            $setArray = array_merge($setArray, ["FieldName" => $fieldname]);
        }

        // needed to avoid php complaints
        $whereArray = [];
        $whereArray = array_merge($whereArray, ["FeedbackID" => $feedbackID]);

        if (is_array($setArray) && count($setArray)>0) {
            // update the thread only if the form data was changed
            $db->update('feedback_bvl_thread', $setArray, $whereArray);
        }

    }

    /**
     * Deleted a thread and its entries
     *
     * @param integer $feedbackID The ID of the feedback thread being closed
     *
     * @return void
     */
    function deleteThread($feedbackID)
    {
        $db = \NDB_factory::singleton()->database();

        // DELETE the thread's entries
        $db->delete(
            'feedback_bvl_entry',
            ["FeedbackID" => $feedbackID]
        );

        // DELETE the thread
        $db->delete(
            'feedback_bvl_thread',
            ["FeedbackID" => '$feedbackID']
        );

    }

    /**
     * Deletes one single entry of a thread
     *
     * @param string $entryID feedback_bvl_entry.ID field
     *
     * @return void
     */
    function deleteEntry($entryID)
    {
        $db = \NDB_Factory::singleton()->database();

        // DELETE the thread entries
        $db->delete('feedback_bvl_entry', ["ID" => $entryID]);
    }

    /**
     * Activates all selected threads, including all inactive threads of lower class
     *
     * @param integer $feedbackID The ID of the feedback thread being closed
     *
     * @return void
     */
    function activateThread($feedbackID=null)
    {
        $db = \NDB_Factory::singleton()->database();

        $setArray = [
            "Active"   => 'Y',
            "Testdate" => "NULL",
        ];

        // only inactive threads can be activated
        $whereArray = ["Active" => 'N'];
        if (!empty($feedbackID)) {
            // only one thread to be activated
            $whereArray = array_merge(
                $whereArray,
                ["FeedbackID" => $feedbackID]
            );
        } elseif (!empty($this->_feedbackObjectInfo['CommentID'])) {
            // activate all thread for the instruments
            $whereArray = array_merge(
                $whereArray,
                ["CommentID" => $this->_feedbackObjectInfo['CommentID']]
            );
        } elseif (!empty($this->_feedbackObjectInfo['SessionID'])) {
            // activate all thread for the timepoint
            $whereArray = array_merge(
                $whereArray,
                ["SessionID" => $this->_feedbackObjectInfo['SessionID']]
            );
        } elseif (!empty($this->_feedbackObjectInfo['CandID'])) {
            // activate all thread for the candidate
            $whereArray = array_merge(
                $whereArray,
                ["CandID" => $this->_feedbackObjectInfo['CandID']]
            );
        } else {
            // at least one of the above has to be true
            throw new Exception("Error: No threads selected to activate");
        }

        $db->update('feedback_bvl_thread', $setArray, $whereArray);
    }

    /**
     * Closes all selected threads, including all active threads of lower class
     *
     * @param int|null $feedbackID The ID of the feedback thread being closed
     *
     * @return int The number of updated threads
     */
    function closeThread(?int $feedbackID = null): int
    {
        $db = \NDB_Factory::singleton()->database();

        $whereStr = 'Public = \'Y\' AND Active = \'Y\' ';
        if (!empty($feedbackID)) {
            // only one thread to be closed
            $whereStr .= 'AND FeedbackID = :v_feedbackid ';
            $params    = ['v_feedbackid' => $feedbackID];

        } elseif (!empty($this->_feedbackObjectInfo['CommentID'])) {
            // close all threads for the instruments
            $commentid = $this->_feedbackObjectInfo['CommentID'];
            $whereStr .= 'AND CommentID = :v_commentid ';
            $params    = ['v_commentid' => $commentid];

        } elseif (!empty($this->_feedbackObjectInfo['SessionID'])) {
            // close all threads for the timepoint
            $sessionid = $this->_feedbackObjectInfo['SessionID'];
            $whereStr .= 'AND SessionID = :v_sessionid ';
            $params    = ['v_sessionid' => $sessionid];

        } elseif (!empty($this->_feedbackObjectInfo['CandID'])) {
            // close all threads for the candidate
            $candid    = $this->_feedbackObjectInfo['CandID'];
            $whereStr .= 'AND CandID = :v_candid ';
            $params    = ['v_candid' => $candid];

        } else {
            // at least one of the above has to be true
            throw new Exception(
                "Error: No threads selected were selected to be closed"
            );
        }
        // close the threads - update feedback_bvl_thread table
        $stmt = $db->prepare(
            '
            UPDATE feedback_bvl_thread
            SET Status = \'closed\', UserID = \'' . $this->_username . '\'
            WHERE ' . $whereStr
        );
        $db->execute($stmt, $params, ['nofetch' => 'true']);
        return $stmt->rowCount();
    }

    /**
     * Used to re-open a thread identified by its feedbackID.
     *
     * @param int $feedbackID The ID of the feedback thread being closed
     *
     * @author Evan McIlroy <evanmcilroy@gmail.com>
     *
     * @return int The number of updated threads
     */
    function openThread(int $feedbackID): int
    {
        $db = \NDB_Factory::singleton()->database();

        $whereStr = 'Public = \'Y\' AND Active = \'Y\' ';

        $whereStr .= 'AND FeedbackID = :v_feedbackid ';

        $params = ['v_feedbackid' => $feedbackID];

        $stmt = $db->prepare(
            '
            UPDATE feedback_bvl_thread
            SET Status = \'opened\', UserID = \'' . $this->_username . '\'
            WHERE ' . $whereStr
        );
        $db->execute($stmt, $params, ['nofetch' => 'true']);
        return $stmt->rowCount();

    }

    /**
     * Returns a [verbose] element name of the feedback_bvl_thread.
     *
     * Status field, i.e. feedback status
     *
     * @param integer $statusID a numerical index of the enum elements
     *                          of the feedback_bvl_thread.Status field
     *
     * @return ?string name of the status
     */
    static function getFeedbackStatusVerbose($statusID): ?string
    {
        if (empty($statusID)) {
            throw new Exception(
                "NDB_BVL_Feedback::getFeedbackStatusVerbose "
                . "Error, empty status ID\n"
            );
        }
        $db = \NDB_Factory::singleton()->database();

        // StatusID is passed in as an integer, but the field in the database
        // is an enum, so we need to do WHERE Status+0= .. to convert it to
        // an int (of the index into the enum) so that this query works.
        $query  = "SELECT Status FROM feedback_bvl_thread WHERE Status+0=:StatID";
        $param  = ['StatID' => $statusID];
        $record = $db->pselectOne($query, $param);
        return $record;
    }
}
