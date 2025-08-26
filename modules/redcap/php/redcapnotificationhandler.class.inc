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
use \LORIS\redcap\RedcapQueries;
use \LORIS\redcap\client\RedcapHttpClient;
use \LORIS\redcap\config\RedcapConfig;
use \LORIS\redcap\client\models\RedcapNotification;
use \LORIS\redcap\client\models\records\RedcapRecord;

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
     * The REDCap module configuration.
     *
     * @var RedcapConfig
     */
    private RedcapConfig $_config;

    /**
     * The REDCap mapper.
     *
     * @var RedcapMapper
     */
    private RedcapMapper $_mapper;

    /**
     * The REDCap module database queries.
     *
     * @var RedcapQueries
     */
    private RedcapQueries $_queries;

    /**
     * Constructor.
     *
     * @param LorisInstance      $loris         The LORIS instance.
     * @param RedcapHttpClient   $redcap_client The REDCap HTTP client.
     * @param RedcapNotification $redcap_notif  The REDCap notification.
     * @param RedcapConfig       $config        The REDCap module configuration.
     */
    public function __construct(
        LorisInstance $loris,
        RedcapHttpClient $redcap_client,
        RedcapNotification $redcap_notif,
        RedcapConfig $config,
    ) {
        $queries = new RedcapQueries($loris);
        $mapper  = new RedcapMapper($redcap_client, $config, $queries);

        $this->_loris         = $loris;
        $this->_redcap_client = $redcap_client;
        $this->_redcap_notif  = $redcap_notif;
        $this->_config        = $config;
        $this->_mapper        = $mapper;
        $this->_queries       = $queries;
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
        // The type checker does not recognize that this variable is always assigned
        // in the code below.
        $records = [];

        try {
            // Acquire LOCK on table to make sure notifications are hanled only once.
            $this->_acquireNotificationLock();

            // get data from redcap
            $records = $this->_redcap_client->getInstrumentRecord(
                $this->_redcap_notif->instrument_name,
                $this->_redcap_notif->unique_event_name,
                $this->_redcap_notif->record_id,
                true,
            );

            $this->_queries->markRedcapNotifAsHandled(
                $this->_redcap_notif->project_id,
                $this->_redcap_notif->record_id,
                $this->_redcap_notif->unique_event_name,
                $this->_redcap_notif->instrument_name,
                $this->_redcap_notif->received_datetime,
                new \DateTimeImmutable(),
            );
        } finally {
            $this->_queries->releaseNotificationLock();
        }

        $candidate_identifier = $this->_mapper->getCandidateIdentifier(
            $this->_redcap_notif->record_id,
            $this->_redcap_notif->instrument_name,
            $this->_redcap_notif->unique_event_name,
        );

        $candidate = $this->_mapper->getCandidateWithIdentifier(
            $candidate_identifier
        );

        $psc_id = $candidate->getPSCID();

        $visit_label = $this->_mapper->getVisitLabel(
            $this->_redcap_notif->unique_event_name,
        );

        // Track which instruments are updated and not updated.
        $instruments_not_updated = [];

        //
        foreach ($records as $record) {
            // if repeating instrument, contains the repeat index
            $instrument_name = $record->getLorisInstrumentName();

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
            throw new \LorisException(
                "[redcap] [pscid:{$psc_id}][visit:$visit_label]"
                . " instrument(s) not updatable."
            );
        }

        // repeating instruments case: some were update, some not
        if (count($instruments_not_updated) > 0) {
            $instruments_error_string = implode(',', $instruments_not_updated);
            throw new \LorisException(
                "[redcap] [pscid:{$psc_id}][visit:$visit_label]"
                . " repeating instruments not updated: $instruments_error_string."
            );
        }

        error_log(
            "[redcap] [pscid:{$psc_id}][visit:$visit_label] instrument updated."
        );
    }

    /**
     * Check that the REDCap and LORIS dictionaries of an instrument match.
     *
     * @param \NDB_BVL_Instrument $instrument a LORIS instrument object
     * @param RedcapRecord        $record     a REDCap instrument record
     *
     * @throws \LorisException if a REDCap field not in LORIS instrument
     *
     * @return void
     */
    private function _assertDictionaryMatches(
        \NDB_BVL_Instrument $instrument,
        RedcapRecord $record
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
        if ($this->_config->prefix_instrument_variable) {
            $record_names = array_values(
                array_map(
                    function ($name) use ($redcap_form_name) {
                        $retval = str_replace("{$redcap_form_name}", '', $name);
                        $retval = ltrim($retval, '_');
                        return $retval;
                    },
                    $record_names
                )
            );
        }

        // if REDCap checkbox (multiselect) options, extract the base name
        // REDCap checkbox is noted by a triple underscore and a the selected
        // option key i.e. "___{optionKey}"
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
        $results = [];

        foreach ($assoc_values as $field_name => $value) {
            preg_match('/(.*)___(.*)/', strval($field_name), $matches);
            if (!empty($matches[1])) {
                // It is an enum field
                $new_field_name = $matches[1];
                $prev_value     = isset($results[$new_field_name])
                    ? [$results[$new_field_name]]
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

            $results[$field_name] = $value;
        }

        return $results;
    }

    /**
     * Update a LORIS instrument data with a REDCap record data.
     *
     * @param \NDB_BVL_Instrument $instrument a LORIS instrument instance
     * @param RedcapRecord        $record     a REDCap record
     *
     * @return void
     */
    private function _updateInstrument(
        \NDB_BVL_Instrument $instrument,
        RedcapRecord $record
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
            $this->_redcap_notif->unique_event_name,
            $this->_redcap_notif->instrument_name,
        );

        if (empty($redcap_notifs)) {
            throw new \LorisException(
                "[redcap] notification already handled or not found."
            );
        }
    }
}
