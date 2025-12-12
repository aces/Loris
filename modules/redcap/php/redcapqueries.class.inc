<?php declare(strict_types=1);

/**
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
use LORIS\redcap\client\models\RedcapDictionaryRecord;
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
class RedcapQueries
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
     * Get the REDCap issue assignee from the configuration tables.
     *
     * @return \User The REDCap issue assignee user.
     */
    public function getRedcapIssueAssignee(): \User
    {
        $assignee_user_id = $this->_db->pselectOne(
            "SELECT c.Value
            FROM Config c
                JOIN ConfigSettings cs ON (cs.ID = c.ConfigID)
            WHERE cs.Name = 'redcap_issue_assignee'
            ",
            []
        );

        if ($assignee_user_id === null) {
            throw new \LorisException(
                "no REDCap issue assignee in configuration, missing"
                . " 'redcap_issue_assignee'."
            );
        }

        $assignee = $this->_db->pselectOne(
            "SELECT DISTINCT u.userID
            FROM users u
                JOIN user_perm_rel upr ON (upr.userid = u.id)
                JOIN permissions p ON (p.permid = upr.permid)
            WHERE u.userID = :usid
                AND u.Active = 'Y'
                AND u.Pending_approval = 'N'
                AND (
                    p.code = 'issue_tracker_developer'
                    OR p.code = 'superuser'
                )
            ",
            ['usid' => $assignee_user_id]
        );

        if ($assignee === null) {
            throw new \LorisException(
                "REDCap issue assignee '$assignee_user_id' does not exist or does"
                . " not have enough privileges."
            );
        }

        return \User::factory($assignee_user_id);
    }

    /**
     * Get a candidate from the database using a given PSCID.
     *
     * @param string $psc_id A potential PSCID.
     *
     * @return ?\Candidate A LORIS candidate, or `null` if no candidate matches the
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
     * @return ?\Candidate A LORIS candidate, or `null` if no candidate matches the
     *                     given CandID.
     */
    public function tryGetCandidateWithCandId(string $cand_id): ?\Candidate
    {
        // Check that the candidate exists first.
        $cand_id = $this->_db->pselectOne(
            "SELECT CandID FROM candidate WHERE CandID = :cand_id",
            ['cand_id' => $cand_id],
        );

        if ($cand_id === null) {
            return null;
        }

        return \Candidate::singleton(new CandID($cand_id));
    }

    /**
     * Get a candidate from the database using a given ExternalID.
     *
     * @param string $external_id A potential ExternalID.
     *
     * @return ?\Candidate A LORIS candidate, or `null` if no candidate matches the
     *                     given ExternalID.
     */
    public function tryGetCandidateWithExternalId(string $external_id): ?\Candidate
    {
        // Check that the candidate exists first.
        $cand_id = $this->_db->pselectOne(
            "SELECT CandID FROM candidate WHERE ExternalID = :external_id",
            ['external_id' => $external_id],
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
     * @return ?string The examiner ID, or `null` if no examiner matches the given
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
     * @param string             $unique_event_name The REDCap unique event name.
     * @param string             $instrument_name   The REDCap instrument name.
     *
     * @return array The list of unhandled notification IDs.
     */
    public function getUnhandledRedcapNotifs(
        \DatetimeImmutable $received_datetime,
        string $project_id,
        string $record_id,
        string $unique_event_name,
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
            'v_redcap_event_name' => $unique_event_name,
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
     * @param string             $unique_event_name The REDCap notification unique
     *                                              event name.
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
        string $unique_event_name,
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
            'v_redcap_event_name' => $unique_event_name,
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
     * Tells if the instrument name is registered in the REDCap dictionary.
     *
     * @param string $instrument_name the instrument name to search
     *
     * @return bool true if the instrument name exists, else false.
     */
    public function instrumentExistsInREDCapDictionary(string $instrument_name): bool
    {
        $dictionary_entry = $this->_db->pselectOne(
            "SELECT DISTINCT FormName
            FROM redcap_dictionary
            WHERE FormName = :fn
            ",
            ["fn" => $instrument_name]
        );
        return $dictionary_entry !== null;
    }

    /**
     * Get a specific REDCap Dictionary entry.
     *
     * @param string $form_name  the searched form name.
     * @param string $field_name the searched field name.
     *
     * @return client\models\RedcapDictionaryRecord|null
     */
    public function getDictionaryEntry(
        string $form_name,
        string $field_name
    ): ?client\models\RedcapDictionaryRecord {
        $dictionary_entry = $this->_db->pselectRow(
            "SELECT
                FieldName,
                FormName,
                SectionHeader,
                FieldType,
                FieldLabel,
                Choices,
                FieldNote,
                TextValidationType,
                TextValidationMin,
                TextValidationMax,
                Identifier,
                BranchingLogic,
                FieldRequired,
                CustomAlignment,
                QuestionNumber,
                MatrixGroupName,
                MatrixRanking,
                FieldAnnotation
            FROM redcap_dictionary
            WHERE FormName = :form_name
                AND FieldName = :field_name
            ",
            [
                "form_name"  => $form_name,
                "field_name" => $field_name
            ]
        );

        if ($dictionary_entry === null) {
            return null;
        }

        // dictionary props
        $clean_props = array_combine(
            RedcapDictionaryRecord::getHeaders(),
            array_values($dictionary_entry)
        );

        // build the object based on props
        return new RedcapDictionaryRecord($clean_props, false);
    }

    /**
     * Insert a REDCap dictionary entry.
     *
     * @param RedcapDictionaryRecord $dictionary_entry the dicitonary entry to insert
     *
     * @return void
     */
    public function insertREDCapDictionaryEntry(
        RedcapDictionaryRecord $dictionary_entry
    ): void {
        $this->_db->insert(
            'redcap_dictionary',
            $dictionary_entry->toDatabaseArray()
        );
    }

    /**
     * Update a REDCap dictionary entry.
     *
     * @param RedcapDictionaryRecord $dictionary_entry the dicitonary entry to insert
     *
     * @return void
     */
    public function updateREDCapDictionaryEntry(
        RedcapDictionaryRecord $dictionary_entry
    ): void {
        $this->_db->update(
            'redcap_dictionary',
            $dictionary_entry->toDatabaseArray(),
            [
                "FormName"  => $dictionary_entry->form_name,
                "FieldName" => $dictionary_entry->field_name
            ]
        );
    }
}
