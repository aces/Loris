<?php declare(strict_types=1);

/**
 * This serves as a hint to LORIS that this module is a real module.
 * It does nothing but implement the module class in the module's namespace.
 *
 * PHP Version 8
 *
 * @category REDCap
 * @package  Main
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\redcap;

use \LORIS\LorisInstance;
use \LORIS\Database\Query;
use \LORIS\StudyEntities\Candidate\CandID;

/**
 * The SQL queries used in the REDCap module.
 *
 * PHP Version 8
 *
 * @category REDCap
 * @package  Main
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Queries
{
    /**
     * The LORIS database.
     *
     * @var \Database
     */
    private \Database $_db;

    /**
     * Constructor.
     *
     * @param LorisInstance $loris The LORIS instance.
     */
    public function __construct(LorisInstance $loris)
    {
        $this->_db = $loris->getDatabaseConnection();
    }

    /**
     * Get a candidate from the database using a given PSCID.
     *
     * @param string $psc_id A potential PSCID.
     *
     * @return ?\Candidate A LORIS candidate, or `NULL` if no candidate matches the
     *                     given PSCID.
     */
    public function tryGetCandidateWithPscId(string $psc_id): ?\Candidate
    {
        $cand_id = $this->_db->pselectOne(
            "SELECT CandID FROM candidate WHERE PSCID = :psc_id",
            ['psc_id' => $psc_id],
        );

        if ($cand_id === null) {
            return null;
        }

        return \Candidate::singleton(new CandID($cand_id));
    }

    /**
     * Get a candidate from the database using a given CandID.
     *
     * @param string $cand_id A potential CandID.
     *
     * @return ?\Candidate A LORIS candidate, or `NULL` if no candidate matches the
     *                     given CandID.
     */
    public function tryGetCandidateWithCandId(string $cand_id): ?\Candidate
    {
        // Check that the candidate exists first.
        $cand_id = $this->_db->pselectOne(
            "SELECT CandID FROM candidate WHERE CandID = :cand_id",
            ['psc_id' => $cand_id],
        );

        if ($cand_id === null) {
            return null;
        }

        return \Candidate::singleton(new CandID($cand_id));
    }

    /**
     * Get an examiner ID from the database using a given examiner full name.
     *
     * @param string $full_name A potential examiner full name, case-insensitive.
     *
     * @return ?string The examiner ID, or `NULL` if no examiner matches the given
     *                 full name.
     */
    public function getExaminerIdWithFullName(string $full_name): ?string
    {
        return $this->_db->pselectOne(
            "SELECT examinerID
                FROM examiners
                WHERE UPPER(full_name) = :full_name
                ",
            ['full_name' => strtoupper($full_name)],
        );
    }

    /**
     * Get the unhandled REDCap notification IDs for the given parameters.
     *
     * @param \DateTimeImmutable $received_datetime The time at which the
     *                                              notification was
     *                                              received.
     * @param string             $project_id        The REDCap project ID.
     * @param string             $record_id         The REDCap record ID.
     * @param string             $event_name        The REDCap event name.
     * @param string             $instrument_name   The REDCap instrument name.
     *
     * @return array The list of unhandled notification IDs.
     */
    public function getUnhandledRedcapNotifs(
        \DatetimeImmutable $received_datetime,
        string $project_id,
        string $record_id,
        string $event_name,
        string $instrument_name,
    ): array {
        $query = "SELECT id
            FROM redcap_notification as lock_1
            WHERE received_dt = :v_received_dt
                AND project_id = :v_project_id
                AND record = :v_record
                AND redcap_event_name = :v_redcap_event_name
                AND instrument = :v_instrument
                AND handled_dt IS NULL
            FOR UPDATE
        ";

        $received_datetime = $received_datetime->format('Y-m-d H:i:s');
        $params            = [
            'v_received_dt'       => $received_datetime,
            'v_project_id'        => $project_id,
            'v_record'            => $record_id,
            'v_redcap_event_name' => $event_name,
            'v_instrument'        => $instrument_name,
        ];

        $stmt = $this->_db->prepare($query);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    /**
     * Mark a REDCap notification as handled.
     *
     * @param string             $project_id        The REDCap notification project
     *                                              ID.
     * @param string             $record_id         The REDCap notification record
     *                                              ID.
     * @param string             $event_name        The REDCap notification event
     *                                              name.
     * @param string             $instrument_name   The instrument name of the
     *                                              REDCap notification.
     * @param \DateTimeImmutable $received_datetime The time at which the REDCap
     *                                              notification is received.
     * @param \DateTimeImmutable $handled_datetime  The time at which the REDCap
     *                                              notification is handled.
     *
     * @return void
     */
    public function markRedcapNotifAsHandled(
        string $project_id,
        string $record_id,
        string $event_name,
        string $instrument_name,
        \DateTimeImmutable $received_datetime,
        \DateTimeImmutable $handled_datetime,
    ): void {
        $stmt = $this->_db->prepare(
            "UPDATE redcap_notification as lock_1
            SET handled_dt = :handled_dt
            WHERE received_dt = :v_received_dt
                AND project_id = :v_project_id
                AND record = :v_record
                AND redcap_event_name = :v_redcap_event_name
                AND instrument = :v_instrument
                AND handled_dt IS NULL"
        );

        $received_datetime = $received_datetime->format('Y-m-d H:i:s');
        $handled_datetime  = $handled_datetime->format('Y-m-d H:i:s');

        $notif_params = [
            'v_received_dt'       => $received_datetime,
            'v_project_id'        => $project_id,
            'v_record'            => $record_id,
            'v_redcap_event_name' => $event_name,
            'v_instrument'        => $instrument_name,
            'handled_dt'          => $handled_datetime,
        ];

        $stmt->execute($notif_params);
    }


    /**
     * Mark a flag as complete.
     *
     * @param string $comment_id The comment ID.
     *
     * @return void
     */
    public function markFlagAsComplete(string $comment_id)
    {
        $stmt = $this->_db->prepare(
            "UPDATE flag
            SET Data_entry = 'Complete',
                Administration = 'All',
                Validity = 'Valid'
            WHERE
                CommentID = :comment_id"
        );
        $stmt->execute(['comment_id' => $comment_id]);
    }

    /**
     * Get a comment ID from the database for a given CandID, visit label, and
     * instrument name.
     *
     * @param CandID $cand_id         The CandID.
     * @param string $visit_label     The visit label.
     * @param string $instrument_name The instrument name.
     *
     * @return ?string The comment ID, or `NULL` if no comment is found for the
     *                 comment parameter.
     */
    public function getCommentId(
        CandID $cand_id,
        string $visit_label,
        string $instrument_name,
    ): ?string {
        return $this->_db->pselectOne(
            "SELECT f.CommentID as CommentID
            FROM flag f
                LEFT JOIN session s ON (f.SessionID = s.ID)
                JOIN test_names tn ON (f.TestID = tn.ID)
            WHERE s.CandID = :cand_id
                AND s.Visit_label = :visit_label
                AND tn.Test_name = :test_name
                AND f.CommentID NOT LIKE 'DDE_%'
            ",
            [
                'cand_id'     => $cand_id,
                'visit_label' => $visit_label,
                'test_name'   => $instrument_name,
            ],
        );
    }

    /**
     * Acquire a lock on the REDCap notifications table.
     *
     * @return void
     */
    public function acquireNotificationLock(): void
    {
        $this->_db->run("LOCK TABLES redcap_notification as lock_1 WRITE");
    }

    /**
     * Release the lock on the REDCap notifications table.
     *
     * @return void
     */
    public function releaseNotificationLock()
    {
        $this->_db->run("UNLOCK TABLES");
    }

    /**
     * Get the list of all instrument records to import from REDCap.
     *
     * @param array $allowedRedcapInstrumentNames authorized redcap instruments
     * @param bool  $forceUpdate                  do force update?
     *
     * @return Query
     */
    public function getLORISInstrumentsToImport(
        array $allowedRedcapInstrumentNames,
        bool $forceUpdate = false
    ): Query {
        // extract first importable instrument name
        $firstInstrumentName     = $allowedRedcapInstrumentNames[0];
        $allOtherInstrumentNames = array_slice(
            $allowedRedcapInstrumentNames,
            1
        );

        // build query for exact instrument name match
        $selectedInstruments  = "AND (";
        $selectedInstruments .= " BINARY f.test_name = '{$firstInstrumentName}'";
        foreach ($allOtherInstrumentNames as $instrumentName) {
            $selectedInstruments .= " OR BINARY f.test_name = '{$instrumentName}'";
        }
        $selectedInstruments .= ")";

        // if forced, then we do not filter out administration/data entry already
        // set up, they will be overridden
        $forceUpdateCondition = "";
        if (!$forceUpdate) {
            $forceUpdateCondition = "
                AND (f.Data_entry = 'In Progress' OR f.Data_entry IS NULL)
                AND f.Administration IS NULL
            ";
        }

        $query = "SELECT c.PSCID as pscid,
            c.CandID as candid,
            s.Visit_label as visitLabel,
            f.test_name as instrument,
            f.CommentID as commentID,
            f.Data_entry as dataEntry,
            f.Administration as administration
        FROM flag f
            JOIN session s ON (s.ID = f.sessionID)
            JOIN candidate c ON (c.candid = s.candid)
        WHERE s.Active = 'Y'
            AND c.Active = 'Y'
            AND f.CommentID NOT LIKE 'DDE%'
            {$forceUpdateCondition}
            {$selectedInstruments}
        ";

        //
        return $this->_db->pselect(
            $query,
            []
        );
    }
}
