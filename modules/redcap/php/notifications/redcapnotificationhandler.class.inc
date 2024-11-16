<?php

namespace LORIS\redcap\notifications;

use \LORIS\LorisInstance;
use \LORIS\redcap\REDCapHTTPClient;
use \LORIS\redcap\notifications\RedcapNotification;
use \LORIS\redcap\models\records\IRedcapRecord;

class RedcapNotificationHandler
{
    /**
     * LORIS fields to be excluded when comparing with REDCap dictionary.
     *
     * @var array
     */
    const LORIS_DD_EXCLUDE_FIELDS = [
        "Date_taken",
        "Candidate_age",
        "Window_Difference",
        "Examiner",
    ];

    /**
     * Loris instance.
     *
     * @var LorisInstance
     */
    private LorisInstance $_loris;

    /**
     * A REDCap client.
     *
     * @var REDCapHTTPClient
     */
    private REDCapHTTPClient $_redcapClient;

    public function __construct(LorisInstance $loris, REDCapHTTPClient $client)
    {
        $this->_loris        = $loris;
        $this->_redcapClient = $client;
    }

    /**
     * Handle a notification.
     *
     * @param RedcapNotification $notification a REDCap notification
     * @throws \LorisException
     * @return void
     */
    public function handle(RedcapNotification $notification): void
    {
        $recordId       = $notification->getRecord();
        $eventName      = $notification->getRedcapEventName();
        $instrumentName = $notification->getInstrument();

        error_log("NOTIF");

        // Acquire LOCK on table to make sure notifications are hanled only once.
        $this->_acquireNotificationLock($notification);

        try {
            // get data from redcap
            $records = $this->_redcapClient->getInstrumentRecord(
                $instrumentName,
                $eventName,
                $recordId,
                true
            );
        } catch (\Throwable $e) {
            $this->_releaseNotificationLock();
            throw $e;
        }
        $this->_markNotificationAsHandled($notification);
        $this->_releaseNotificationLock();

        // get visit name
        error_log("here");
        $visitMap  = $this->_getREDCapEventMapping();
        $visitName = $visitMap[$eventName];

        error_log("visit: " . $visitName);

        // track how many are updated, init all to false
        $updated = array_map(fn($v) => false, $records);

        //
        foreach ($records as $index => $record) {
            // if repeating instrument, contains the repeat index
            $instrumentName = $record->getInstrumentName();

            // get the comment ID for that instrument
            $commentid = $this->_getCommentID(
                $recordId,
                $visitName,
                $instrumentName
            );

            // instrument obj
            // TODO: for repeating instruments, the instrument with repeat_index
            // has to be created and accessible before using this.
            $instrument = \NDB_BVL_Instrument::factory(
                $this->_loris,
                $instrumentName,
                $commentid
            );

            // check if instrument has "Data_entry = 'In Progress'"
            if (!$instrument->determineDataEntryAllowed()) {
                fprintf(
                    STDERR,
                    "[redcap] [pscid:$recordId][visit:$visitName][instrument:$instrumentName] instrument already 'complete'."
                );
                continue;
            }

            // dictionary diff between LORIS and REDCap match
            $this->_assertDictionaryMatches($instrument, $record);

            // update instrument
            $this->_updateInstrument($instrument, $record);

            // instrument updated
            $updated[$index] = true;
        }

        // all not update = raise error
        $nRecords    = count($records);
        $notUpdated  = array_filter($updated, fn($v) => $v);
        $nNotUpdated = count($notUpdated);
        if ($nNotUpdated == $nRecords) {
            $msg = "[redcap] [pscid:$recordId][visit:$visitName][instrument:$instrumentName] instrument(s) not updatable.";
            throw new \LorisException($msg);
        }
        // repeating instruments case: some were update, some not
        if ($nNotUpdated > 0) {
            $recNotUpdated = array_map(fn($k) => $records[$k]->getInstrumentName(), $notUpdated);
            $recMsg        = implode(',', $recNotUpdated);
            $msg = "[redcap] [pscid:$recordId][visit:$visitName] repeating instruments not updated: $recMsg.";
            throw new \LorisException($msg);
        }
        sprintf(
            STDOUT,
            "[redcap] [pscid:$recordId][visit:$visitName][instrument:$instrumentName] instrument updated."
        );
    }

    /**
     * Check that REDCap and LORIS dictionaries matchfor this instrument.
     *
     * @param \NDB_BVL_Instrument $instrument a LORIS instrument object
     * @param IRedcapRecord $record           a REDCap instrument record
     *
     * @throws \LorisException if a REDCap field not in LORIS instrument
     *
     * @return void
     */
    private function _assertDictionaryMatches(
        \NDB_BVL_Instrument $instrument,
        IRedcapRecord $record
    ): void {
        // var
        $instrument_name  = $instrument->testName;
        $redcap_form_name = $record->getFormName();
        $dict_names       = [];

        // -- LORIS INSTRUMENTS
        // Remove instrument name from LORIS field names (trim the first part)
        // E.g. from 'form_name_and_field_name' to 'and_field_name'
        foreach ($instrument->getDataDictionary() as $field) {
            $dict_names[] = preg_replace(
                "/^${instrument_name}_/",
                "",
                $field->getName()
            );
        }

        // Remove LORIS internal fields
        $dict_names = array_filter(
            $dict_names,
            function ($name) {
                return !in_array(
                    $name,
                    self::LORIS_DD_EXCLUDE_FIELDS
                );
            }
        );

        // -- REDCap INSTRUMENTS
        // Remove REDCap specific fields
        $record_names = array_filter(
            $record->getPropertyNames(),
            function ($name) use ($redcap_form_name) {
                return !in_array(
                    $name,
                    [
                        "redcap_survey_identifier",
                        $redcap_form_name . "_timestamp",
                        $redcap_form_name . "_complete",
                    ]
                );
            }
        );

        // Remove instrument name from REDCap field names
        $record_names = array_map(
            function ($name) use ($redcap_form_name) {
                $retval = str_replace("{$redcap_form_name}", '', $name);
                $retval = ltrim($retval, '_');
                return $retval;
            },
            $record_names
        );

        $record_names = array_unique(
            array_reduce(
                $record_names,
                function ($names, $name) {
                    preg_match('/(.*)[_][_][_](.*)/', $name, $matches);
                    if (!empty($matches[1])) {
                        $name = $matches[1];
                    }
                    $names[] = $name;
                    return $names;
                },
                []
            )
        );

        // -- DIFF LORIS-REDCap FIELD NAMES
        // Make sure all REDCap fields exists in LORIS.
        // Note: Score fields should be removed to have an exact match.
        $missing_fields = array_diff($record_names, $dict_names);
        if (!empty($missing_fields)) {
            $mf  = implode(', ', $missing_fields);
            $msg = "[redcap] missing fields in LORIS: $mf";
            throw new \LorisException($msg);
        }
    }

    /**
     * Turn REDCap enum values into LINST answers.
     * Format as "value{@}value{@}value..."
     *
     * @param array $assoc_values REDCap instrument values
     *
     * @return array
     */
    private static function _formatEnumFields(array $assoc_values): array
    {
        $keys    = array_keys($assoc_values);
        $reduced = array_reduce(
            $keys,
            function ($carry, $item) use ($assoc_values) {
                $field_name = $item;
                $value      = $assoc_values[$field_name];

                preg_match('/(.*)[_][_][_](.*)/', $item, $matches);
                if (!empty($matches[1])) {
                    // It is an enum field
                    $new_fieldname = $matches[1];
                    $prev_value    = isset($carry[$new_fieldname]) ? [$carry[$new_fieldname]] : [];
                    $new_value     = $prev_value;

                    if ($value == '1') {
                        // The value is selected
                        $value     = [$matches[2]];
                        $new_value = [implode('{@}', array_merge($prev_value, $value))];
                    }

                    $value      = array_shift($new_value);
                    $field_name = $new_fieldname;
                }

                if (!isset($carry[$field_name])) {
                    $carry[$field_name] = null;
                }

                $carry[$field_name] = $value;

                return $carry;

            },
            []
        );

        return $reduced;
    }

    /**
     * Update a LORIS instrument data with a REDCap record data.
     *
     * @param \NDB_BVL_Instrument $instrument a LORIS instrument instance
     * @param IRedcapRecord $record           a REDCap record
     *
     * @return void
     */
    private function _updateInstrument(
        \NDB_BVL_Instrument $instrument,
        IRedcapRecord $record
    ): void {
        // db
        $db = $this->_loris->getDatabaseConnection();

        // var
        $instrument_name   = $record->getFormName();
        $instrument_values = $record->toArray();
        $commentid         = $instrument->getCommentID();

        // Add Examiner
        $instrument_values['Examiner'] = $this->_getRedcapExaminerId();

        // Remove instrument name from field name
        foreach ($instrument_values as $key => $value) {
            $new_key = str_replace("{$instrument_name}", '', $key);
            $new_key = ltrim($new_key, '_');
            if ($key != $new_key) {
                $instrument_values[$new_key] = $value;
                unset($instrument_values[$key]);
            }
        }

        // -- Define/Add Date_taken
        // First, try based on 'dtt'
        // Then, if still null/undefined try based on 'timestamp_stop'
        // Then, if still null/undefined try based on 'timestamp_start'
        // Finally, if still null/undefined use current datetime
        $dt = \DateTime::createFromFormat('Y-m-d H:i:s', $instrument_values['dtt']);
        if (!$dt) {
            error_log("[redcap] Could not parse 'dtt': " . $instrument_values['dtt']);
        } else {
            $instrument_values['Date_taken'] = $dt->format('Y-m-d');
        }

        // if null/empty, try getting that based on the timestamp
        if (is_null($instrument_values['Date_taken']) || empty($instrument_values['Date_taken'])) {
            if (isset($instrument_values['timestamp'])) {
                $dt = \DateTime::createFromFormat('Y-m-d H:i:s', $instrument_values['timestamp']);
                if (!$dt) {
                    error_log("[redcap] Could not parse 'timestamp': " . $instrument_values['timestamp']);
                } else {
                    $instrument_values['Date_taken'] = $dt->format('Y-m-d');
                }
            }
        }

        // if null/empty, try getting that based on the timestamp_start
        if (is_null($instrument_values['Date_taken']) || empty($instrument_values['Date_taken'])) {
            if (isset($instrument_values['timestamp_start'])) {
                $dt = \DateTime::createFromFormat('Y-m-d H:i:s', $instrument_values['timestamp_start']);
                if (!$dt) {
                    error_log("[redcap] Could not parse 'timestamp_start': " . $instrument_values['timestamp_start']);
                } else {
                    $instrument_values['Date_taken'] = $dt->format('Y-m-d');
                }
            }
        }

        // if still null/empty, get the current date
        if (is_null($instrument_values['Date_taken']) || empty($instrument_values['Date_taken'])) {
            $instrument_values['Date_taken'] = (new \DateTimeImmutable())->format('Y-m-d');
        }

        // add the timestamp_stop in the values based on the last timestamp
        if (!is_null($instrument_values['timestamp'])
            && !empty($instrument_values['timestamp'])
        ) {
            // rename var to uniformize with other LORIS instruments
            // Duration will be calculated when _saveValues is called.
            $instrument_values['timestamp_stop'] = $instrument_values['timestamp'];
        }

        // Aggregate enum values in a single field
        $instrument_values = $this->_formatEnumFields($instrument_values);

        // save values, score the instrument and mark mandatory elements done
        $instrument->_saveValues($instrument_values);
        $instrument->score();
        $instrument->updateRequiredElementsCompletedFlag();

        // Mark data entry complete
        $stmt = $db->prepare(
            "UPDATE flag
            SET Data_entry = 'Complete',
                Administration = 'All',
                Validity = 'Valid'
            WHERE
                CommentID = :commentid
        ");
        $stmt->execute(['commentid' => $commentid]);
    }

    /**
     * Get a commentID for a given participant/instrument/visit tuple.
     *
     * @param string $pscid
     * @param string $visitName
     * @param string $instrumentName
     * @throws \LorisException
     * @return string
     */
    private function _getCommentID(
        string $pscid,
        string $visitName,
        string $instrumentName
    ): string {
        $db = $this->_loris->getDatabaseConnection();
        try {
            $commentID = $db->pselectOne(
                "SELECT f.CommentID as CommentID
                FROM flag f
                    LEFT JOIN session s ON (f.SessionID = s.ID)
                    LEFT JOIN candidate c ON (c.CandID = s.CandID)
                WHERE c.PSCID = :pscid
                    AND f.Test_name = :instrument
                    AND s.Visit_label = :visit
                    AND f.CommentID NOT LIKE 'DDE_%'
                ",
                [
                    'pscid'      => $pscid,
                    'visit'      => $visitName,
                    'instrument' => $instrumentName
                ]
            );
        } catch (\Throwable $th) {
            $msg = "[redcap] Error: issue selecting the commentID for pscid:$pscid, visit:$visitName, instrument:$instrumentName";
            throw new \LorisException($msg);
        }

        if (is_null($commentID)) {
            $msg = "[redcap] Error: no record in flag table for pscid:$pscid, visit:$visitName, instrument:$instrumentName";
            throw new \LorisException($msg);
        }

        return $commentID;
    }

    /**
     * Get the 'redcap' examiner ID.
     *
     * @return string the redcap examiner ID.
     */
    private function _getRedcapExaminerId(): string
    {
        $db = $this->_loris->getDatabaseConnection();
        return $db->pselectOne(
            "SELECT examinerID
            FROM examiners
            WHERE UPPER(full_name) = 'REDCAP'
            ",
            []
        );
    }

    /**
     * Get the REDCap event mapping.
     * @return array an associative array (unique event name => event name)
     */
    private function _getREDCapEventMapping(): array
    {
        $m = [];
        foreach ($this->_redcapClient->getEvents() as $event) {
            // e.g. v9_arm_1 => V09
            $m[$event->getEventUniqueName()] = $event->getName();
        }
        return $m;
    }

    /**
     * Lock a notification.
     *
     * @param RedcapNotification $notification a REDCap notification
     *
     * @throws \LorisException
     *
     * @return void
     */
    private function _acquireNotificationLock(RedcapNotification $notification): void
    {
        $db = $this->_loris->getDatabaseConnection();
        $db->run("LOCK TABLES redcap_notification as lock_1 WRITE");

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

        $notification_params = [
            'v_received_dt'       => $notification->getReceivedDt()->format('Y-m-d H:i:s'),
            'v_project_id'        => $notification->getProjectId(),
            'v_record'            => $notification->getRecord(),
            'v_redcap_event_name' => $notification->getRedcapEventName(),
            'v_instrument'        => $notification->getInstrument()
        ];

        $stmt = $db->prepare($query);
        $stmt->execute($notification_params);
        $results = $stmt->fetchAll();

        if (empty($results)) {
            $this->_releaseNotificationLock();
            throw new \LorisException(
                "[redcap] notification already handled or not found."
            );
        }
    }

    /**
     * Mark a REDCap notification as answered.
     *
     * @param RedcapNotification $notification a REDCap notification
     * @return void
     */
    private function _markNotificationAsHandled(RedcapNotification $notification): void
    {
        $db   = $this->_loris->getDatabaseConnection();
        $stmt = $db->prepare("UPDATE redcap_notification as lock_1
            SET handled_dt = :handled_dt
            WHERE received_dt = :v_received_dt
                AND project_id = :v_project_id
                AND record = :v_record
                AND redcap_event_name = :v_redcap_event_name
                AND instrument = :v_instrument
                AND handled_dt IS NULL
        ");

        $now = (new \DateTimeImmutable())->format('Y-m-d H:i:s');

        $notification_params = [
            'v_received_dt'       => $notification->getReceivedDt()->format('Y-m-d H:i:s'),
            'v_project_id'        => $notification->getProjectId(),
            'v_record'            => $notification->getRecord(),
            'v_redcap_event_name' => $notification->getRedcapEventName(),
            'v_instrument'        => $notification->getInstrument(),
            'handled_dt'          => $now
        ];

        $stmt->execute($notification_params);
    }

    /**
     * Release REDCap notification lock.
     *
     * @return void
     */
    private function _releaseNotificationLock(): void
    {
        $db = $this->_loris->getDatabaseConnection();
        $db->run("UNLOCK TABLES");
    }
}
