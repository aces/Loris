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
use \LORIS\redcap\Queries;
use \LORIS\redcap\client\RedcapHttpClient;
use \LORIS\redcap\config\RedcapConfig;
use \LORIS\redcap\config\RedcapConfigLorisCandidateId;
use \LORIS\redcap\config\RedcapConfigRedcapParticipantId;
use \LORIS\redcap\client\models\records\IRedcapRecord;
use \LORIS\redcap\client\models\RedcapEvent;
use \LORIS\redcap\client\models\RedcapNotification;

/**
 * This represents a REDCap notification handler.
 *
 * @category REDCap
 * @package  Main
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
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
     * THe LORIS instance.
     *
     * @var LorisInstance
     */
    private LorisInstance $_loris;

    /**
     * The database queries used by this pipeline.
     *
     * @var Queries
     */
    private Queries $_queries;

    /**
     * The REDCap module configuration.
     *
     * @var RedcapConfig
     */
    private RedcapConfig $_redcap_config;

    /**
     * The REDCap HTTP client.
     *
     * @var RedcapHttpClient
     */
    private RedcapHttpClient $_redcap_client;

    /**
     * The REDCap notification.
     *
     * @var RedcapNotification
     */
    private RedcapNotification $_redcap_notif;

    /**
     * Contructor.
     *
     * @param LorisInstance      $loris         A LORIS instance.
     * @param RedcapConfig       $redcap_config A REDCap module configuration.
     * @param RedcapHttpClient   $redcap_client A REDCap HTTP client.
     * @param RedcapNotification $redcap_notif  A REDCap notification.
     */
    public function __construct(
        LorisInstance $loris,
        RedcapConfig $redcap_config,
        RedcapHttpClient $redcap_client,
        RedcapNotification $redcap_notif,
    ) {
        $this->_loris         = $loris;
        $this->_queries       = new Queries($loris);
        $this->_redcap_config = $redcap_config;
        $this->_redcap_client = $redcap_client;
        $this->_redcap_notif  = $redcap_notif;
    }

    /**
     * Handle a notification.
     *
     * @throws \LorisException
     *
     * @return void
     */
    public function handle(): void
    {
        error_log("NOTIF");

        try {
            // Acquire LOCK on table to make sure notifications are hanled only once.
            $this->_acquireNotificationLock();

            // get data from redcap
            $records = $this->_redcap_client->getInstrumentRecord(
                $this->_redcap_notif->instrument_name,
                $this->_redcap_notif->event_name,
                $this->_redcap_notif->record_id,
                true,
            );

            $this->_queries->markRedcapNotifAsHandled(
                $this->_redcap_notif->project_id,
                $this->_redcap_notif->record_id,
                $this->_redcap_notif->event_name,
                $this->_redcap_notif->instrument_name,
                $this->_redcap_notif->received_datetime,
                new \DateTimeImmutable(),
            );
        } finally {
            $this->_queries->releaseNotificationLock();
        }

        $participant_id = $this->_getRedcapParticipantId();

        $candidate = $this->_getCandidateWithRedcapParticipantId($participant_id);
        $psc_id    = $candidate->getPSCID();

        $visit_label = $this->_getVisitLabel();

        // Track which instruments are updated and not updated.
        $instruments_updated     = [];
        $instruments_not_updated = [];

        //
        foreach ($records as $record) {
            // if repeating instrument, contains the repeat index
            $instrument_name = $record->getInstrumentName();

            // get the comment ID for that instrument
            $comment_id = $this->_getCommentId(
                $candidate,
                $visit_label,
                $instrument_name,
            );

            // instrument obj
            // TODO: for repeating instruments, the instrument with repeat_index
            // has to be created and accessible before using this.
            $instrument = \NDB_BVL_Instrument::factory(
                $this->_loris,
                $instrument_name,
                $comment_id,
            );

            // check if instrument has "Data_entry = 'In Progress'"
            if (!$instrument->determineDataEntryAllowed()) {
                error_log(
                    "[redcap] [pscid:{$psc_id}][visit:$visit_label]"
                    . "[instrument:$instrument_name] instrument already 'complete'."
                );

                // Mark the instrument as not updated.
                $instruments_not_updated[] = $instrument_name;
                continue;
            }

            // dictionary diff between LORIS and REDCap match
            $this->_assertDictionaryMatches($instrument, $record);

            // update instrument
            $this->_updateInstrument($instrument, $record);

            // Mark the instrument as updated.
            $instruments_updated[] = $instrument_name;
        }

        // all not update = raise error
        if (count($instruments_not_updated) === count($records)) {
            $msg = "[redcap] [pscid:{$psc_id}][visit:$visit_label]"
                ."[instrument:$instrument_name] instrument(s) not updatable.";
            throw new \LorisException($msg);
        }

        // repeating instruments case: some were update, some not
        if (count($instruments_not_updated) > 0) {
            $recMsg = implode(',', $instruments_not_updated);
            $msg    = "[redcap] [pscid:{$psc_id}][visit:$visit_label]"
                . " repeating instruments not updated: $recMsg.";
            throw new \LorisException($msg);
        }

        error_log(
            "[redcap] [pscid:{$psc_id}][visit:$visit_label]"
            . "[instrument:$instrument_name] instrument updated."
        );
    }

    /**
     * Find the visit label associated with the REDCap notification based on the
     * REDCap module configuration.
     *
     * @return ?string The LORIS visit label associated with the REDCap
     *                 notification, or `NULL` if no corresponding visit label is
     *                 found.
     */
    private function _getVisitLabel(): ?string
    {
        // Get the list of all the REDCap events for this REDCap project.
        $redcap_events = $this->_redcap_client->getEvents();

        // Find the REDCap event that matches the REDCap notification event.
        $redcap_event = array_find(
            $redcap_events,
            fn($redcap_event) => (
                $redcap_event->unique_name === $this->_redcap_notif->event_name
            ),
        );

        // There should always be a REDCap event that matches the REDCap
        // notification event, but since this is an external API, check this
        // assumption nonetheless.
        if ($redcap_event === null) {
            throw new \LorisException(
                "[redcap] Error: No REDCap event found for notification event name"
                . " '{$this->_redcap_notif->event_name}'."
            );
        }

        // If there is no visit mappings in the REDCap module configuration, simply
        // use the REDCap event name as the LORIS vist name.
        if ($this->_redcap_config->visits === null) {
            return $redcap_event->name;
        }

        $event_name = $redcap_event->name;
        $arm_name   = $this->_getRedcapEventArmName($redcap_event);

        // Look for the REDCap module configuration visit mappings that match the
        // REDCap notification event, using the event name and arm name.
        $visit_mappings = array_filter(
            $this->_redcap_config->visits,
            function ($visit_config) use ($event_name, $arm_name) {
                if ($visit_config->redcap_event_name !== null
                    && $visit_config->redcap_event_name !== $event_name
                ) {
                    return false;
                }

                if ($visit_config->redcap_arm_name !== null
                    && $visit_config->redcap_arm_name !== $arm_name
                ) {
                    return false;
                }

                return true;
            },
        );

        // If there is no visit mapping that match the REDCap notification event,
        // return `null` and ignore this notification.
        if (count($visit_mappings) === 0) {
            return null;
        }

        // If there are several visit mappings that match the REDCap notification
        // event, raise an error.
        if (count($visit_mappings) !== 1) {
            throw new \LorisException(
                "[redcap] Error: Multiple visits selectable for event name"
                . " '$event_name' and arm name '$arm_name'."
            );
        }

        // Return the LORIS visit label associated with the matching visit mapping.
        return reset($visit_mappings)->visit_label;
    }

    /**
     * Get the appropriate participant identifier of the REDCap notification based
     * on the REDCap module configuration.
     *
     * @return string The REDCap participant identifier.
     */
    private function _getRedcapParticipantId(): string
    {
        $record_id = $this->_redcap_notif->record_id;

        // If the REDCap module configuration is to use the REDCap record ID, simply
        // return the REDCap notification record ID.
        $condition = $this->_redcap_config->redcap_participant_id
            === RedcapConfigRedcapParticipantId::RecordId;

        if ($condition) {
            return $record_id;
        }

        // Get the list of all REDCap survey participants for the notification
        // instrument and event.
        $participants = $this->_redcap_client->getSurveyParticipants(
            $this->_redcap_notif->instrument_name,
            $this->_redcap_notif->event_name,
        );

        // Find the survey participant matching the notification record.
        $participant = array_find(
            $participants,
            fn($participant) => $participant->record === $record_id
        );

        // If no survey participant is found for that record, raise an error. This
        // can happen because even with surveys enabled in REDCap, there is no
        // requirement for all records to be linked to survey participants.
        if ($participant === null) {
            throw new \LorisException(
                "[redcap] Error: No survey participant found for record ID"
                . " '$record_id'."
            );
        }

        // If the REDCap survey participant does not have a custom identifier, raise
        // an error. This can happen because the survey participant identifier must
        // be set manually in REDCap and is optional.
        if ($participant->identifier === null) {
            throw new \LorisException(
                "[redcap] Error: Survey participant has no identifier for"
                . " record ID '$record_id'."
            );
        }

        // Return the identifier of the survey participant.
        return $participant->identifier;
    }

    /**
     * Get the LORIS candidate that matches a REDCap participant identifier based
     * on the REDCap module configuration.
     *
     * @param string $redcap_participant_id The REDCap participant identifier.
     *
     * @return \Candidate The LORIS candidate.
     */
    private function _getCandidateWithRedcapParticipantId(
        string $redcap_participant_id,
    ): \Candidate {
        // Get the candidate using the REDCap participant identifier as a CandID or
        // PSCID depending on the REDCap module configuration.
        $candidate = match ($this->_redcap_config->candidate_id) {
            RedcapConfigLorisCandidateId::CandId =>
                $this->_queries->tryGetCandidateWithCandId($redcap_participant_id),
            RedcapConfigLorisCandidateId::PscId =>
                $this->_queries->tryGetCandidateWithPscId($redcap_participant_id),
        };

        // If no candidate matches the REDCap participant identifier, raise an
        // error.
        if ($candidate === null) {
            throw new \LorisException(
                "[redcap] Error: No LORIS candidate found for REDCap participant"
                . " identifier '$redcap_participant_id'."
            );
        }

        // Return the candidate.
        return $candidate;
    }

    /**
     * Get the REDCap arm name of a REDCap event.
     *
     * @param RedcapEvent $redcap_event A REDCap event.
     *
     * @return string The REDCap event arm name.
     */
    private function _getRedcapEventArmName(RedcapEvent $redcap_event): string
    {
        // Get the list of all the REDCap arms for this REDCap project.
        $redcap_arms = $this->_redcap_client->getArms();

        // Find the REDCap arm that matches the REDCap event.
        $redcap_arm = array_find(
            $redcap_arms,
            fn($redcap_arm) => $redcap_arm->number === $redcap_event->arm_number,
        );

        // There should always be a REDCap arm that matches the REDCap event arm,
        // but since this is an external API, check this
        // assumption nonetheless.
        if ($redcap_arm === null) {
            throw new \LorisException(
                "[redcap] Error: No REDCap arm found for event arm number"
                . " '{$redcap_event->arm_number}'."
            );
        }

        // Return the name of the REDCap arm.
        return $redcap_arm->name;
    }

    /**
     * Check that REDCap and LORIS dictionaries matchfor this instrument.
     *
     * @param \NDB_BVL_Instrument $instrument a LORIS instrument object
     * @param IRedcapRecord       $record     a REDCap instrument record
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
                "/^{$instrument_name}_/",
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
                        "redcap_data_access_group",
                        "redcap_event_name",
                        "redcap_survey_identifier",
                        "{$redcap_form_name}_timestamp",
                        "{$redcap_form_name}_complete",
                    ]
                );
            }
        );

        // Remove instrument name from REDCap variable names if the variables are
        // prefixed by the instrument name.
        if ($this->_redcap_config->prefix_instrument_variable) {
            $record_names = array_map(
                function ($name) use ($redcap_form_name) {
                    $retval = str_replace("{$redcap_form_name}", '', $name);
                    $retval = ltrim($retval, '_');
                    return $retval;
                },
                $record_names
            );
        }

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
                    $new_field_name = $matches[1];
                    $prev_value     = isset($carry[$new_field_name])
                        ? [$carry[$new_field_name]]
                        : [];
                    $new_value      = $prev_value;

                    if ($value == '1') {
                        // The value is selected
                        $value     = [$matches[2]];
                        $new_value = [
                            implode(
                                '{@}',
                                array_merge($prev_value, $value)
                            )
                        ];
                    }

                    $value      = array_shift($new_value);
                    $field_name = $new_field_name;
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
     * @param IRedcapRecord       $record     a REDCap record
     *
     * @return void
     */
    private function _updateInstrument(
        \NDB_BVL_Instrument $instrument,
        IRedcapRecord $record
    ): void {
        // var
        $instrument_name   = $record->getFormName();
        $instrument_values = $record->toArray();
        $comment_id        = $instrument->getCommentID();

        // Add Examiner
        $instrument_values['Examiner'] = $this->_getRedcapExaminerId();

        // Remove instrument name from field name
        foreach ($instrument_values as $key => $value) {
            $new_key = str_replace($instrument_name, '', $key);
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
        if (isset($instrument_values['dtt'])) {
            $dt = \DateTime::createFromFormat(
                'Y-m-d H:i:s',
                $instrument_values['dtt'],
            );

            if (!$dt) {
                error_log(
                    "[redcap] Could not parse 'dtt': "
                    . $instrument_values['dtt']
                );
            } else {
                $instrument_values['Date_taken'] = $dt->format('Y-m-d');
            }
        }

        // if null/empty, try getting that based on the timestamp
        if (isset($instrument_values['Date_taken'])
            || empty($instrument_values['Date_taken'])
        ) {
            if (isset($instrument_values['timestamp'])) {
                $dt = \DateTime::createFromFormat(
                    'Y-m-d H:i:s',
                    $instrument_values['timestamp']
                );
                if (!$dt) {
                    error_log(
                        "[redcap] Could not parse 'timestamp': "
                        . $instrument_values['timestamp']
                    );
                } else {
                    $instrument_values['Date_taken'] = $dt->format('Y-m-d');
                }
            }
        }

        // if null/empty, try getting that based on the timestamp_start
        if (isset($instrument_values['Date_taken'])
            || empty($instrument_values['Date_taken'])
        ) {
            if (isset($instrument_values['timestamp_start'])) {
                $dt = \DateTime::createFromFormat(
                    'Y-m-d H:i:s',
                    $instrument_values['timestamp_start']
                );
                if (!$dt) {
                    error_log(
                        "[redcap] Could not parse 'timestamp_start': "
                        . $instrument_values['timestamp_start']
                    );
                } else {
                    $instrument_values['Date_taken'] = $dt->format('Y-m-d');
                }
            }
        }

        // if still null/empty, get the current date
        if (isset($instrument_values['Date_taken'])
            || empty($instrument_values['Date_taken'])
        ) {
            $dtNow = new \DateTimeImmutable();
            $instrument_values['Date_taken'] = $dtNow->format('Y-m-d');
        }

        // add the timestamp_stop in the values based on the last timestamp
        if (isset($instrument_values['timestamp'])
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

        $this->_queries->markFlagAsComplete($comment_id);
    }

    /**
     * Get a commentID for a given participant/instrument/visit tuple.
     *
     * @param \Candidate $candidate       A candidate.
     * @param string     $visit_label     A visit label.
     * @param string     $instrument_name An instrument backend name.
     *
     * @throws \LorisException
     *
     * @return string
     */
    private function _getCommentId(
        \Candidate $candidate,
        string $visit_label,
        string $instrument_name,
    ): string {
        $psc_id = $candidate->getPSCID();

        $comment_id = $this->_queries->getCommentId(
            $candidate->getCandID(),
            $visit_label,
            $instrument_name,
        );

        if ($comment_id === null) {
            $msg = "[redcap] Error: no record in flag table for pscid:$psc_id,"
                ." visit:$visit_label, instrument:$instrument_name";
            throw new \LorisException($msg);
        }

        return $comment_id;
    }

    /**
     * Get the 'redcap' examiner ID.
     *
     * @return ?string the redcap examiner ID.
     */
    private function _getRedcapExaminerId(): ?string
    {
        return $this->_queries->getExaminerIdWithFullName('REDCap');
    }

    /**
     * Lock a notification.
     *
     * @throws \LorisException
     *
     * @return void
     */
    private function _acquireNotificationLock(): void
    {
        $this->_queries->acquireNotificationLock();

        $redcap_notifs = $this->_queries->getUnhandledRedcapNotifs(
            $this->_redcap_notif->received_datetime,
            $this->_redcap_notif->project_id,
            $this->_redcap_notif->record_id,
            $this->_redcap_notif->event_name,
            $this->_redcap_notif->instrument_name,
        );

        if (empty($redcap_notifs)) {
            throw new \LorisException(
                "[redcap] notification already handled or not found."
            );
        }
    }
}
