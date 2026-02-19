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
use \LORIS\redcap\client\models\RedcapDictionaryRecord;
use \LORIS\redcap\config\RedcapConfig;
use \LORIS\redcap\client\models\records\RedcapRecord;

/**
 * This represents a REDCap record importer.
 *
 * @category REDCap
 * @package  Main
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class RedcapRecordImporter
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
     * Cache of REDCap yes/no fields by instrument.
     *
     * @var array<string, array<string>>
     */
    private array $_yesno_fields_by_instrument = [];

    /**
     * The visit label of the REDCap record being imported.
     *
     * @var string
     */
    public string $visit_label;

    /**
     * Constructor.
     *
     * @param LorisInstance    $loris         The LORIS instance.
     * @param RedcapHttpClient $redcap_client The REDCap HTTP client.
     * @param RedcapConfig     $config        The REDCap module configuration.
     */
    public function __construct(
        LorisInstance $loris,
        RedcapHttpClient $redcap_client,
        RedcapConfig $config,
    ) {
        $queries = new RedcapQueries($loris);
        $mapper  = new RedcapMapper($loris, $redcap_client, $config);

        $this->_loris         = $loris;
        $this->_redcap_client = $redcap_client;
        $this->_config        = $config;
        $this->_mapper        = $mapper;
        $this->_queries       = $queries;
    }

    /**
     * Import a REDCap record into LORIS.
     *
     * @param RedcapRecord $record The REDCap record.
     *
     * @return bool Whether or not the record has been succesfully imported.
     */
    public function import(RedcapRecord $record): bool
    {
        // if repeating instrument, contains the repeat index
        $instrument_name = $record->getLorisInstrumentName();

        $candidate_identifier = $this->_mapper->getCandidateIdentifier(
            $record->record_id,
            $instrument_name,
            $record->unique_event_name,
        );

        $candidate = $this->_mapper->getCandidateWithIdentifier(
            $candidate_identifier
        );

        $psc_id = $candidate->getPSCID();

        $this->visit_label = $this->_mapper->getVisitLabel(
            $record,
            $candidate,
        );

        // get the comment ID for that instrument
        $comment_id = $this->_getCommentId(
            $candidate,
            $this->visit_label,
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
                "[redcap] [pscid:{$psc_id}][visit:$this->visit_label]"
                . "[instrument:$instrument_name] instrument already 'complete'."
            );

            return false;
        }

        // dictionary diff between LORIS and REDCap match
        $this->_assertDictionaryMatches($instrument, $record);

        // update instrument
        $this->_updateInstrument($instrument, $record);

        return true;
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
        RedcapRecord $record,
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
                        "record_id",
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
                    preg_match('/(.*)___(.*)/', $name, $matches);
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
     * Get the REDCap yes/no field names for an instrument.
     *
     * @param string $instrument_name The REDCap instrument name.
     *
     * @return array<string> The yes/no field names.
     */
    private function _getYesNoFieldNames(string $instrument_name): array
    {
        if (array_key_exists(
            $instrument_name,
            $this->_yesno_fields_by_instrument
        )) {
            return $this->_yesno_fields_by_instrument[$instrument_name];
        }

        $dictionary = $this->_redcap_client->getDataDictionary(
            [$instrument_name]
        );

        $yesno_fields = array_map(
            fn(RedcapDictionaryRecord $record) => $record->field_name,
            array_filter(
                $dictionary,
                fn(RedcapDictionaryRecord $record) => (
                    $record->field_type === 'yesno'
                )
            )
        );

        // Remove instrument name from REDCap variable names if configured.
        if ($this->_config->prefix_instrument_variable) {
            $yesno_fields = array_values(
                array_map(
                    function ($field_name) use ($instrument_name) {
                        $retval = str_replace(
                            "{$instrument_name}",
                            '',
                            $field_name
                        );
                        $retval = ltrim($retval, '_');
                        return $retval;
                    },
                    $yesno_fields
                )
            );
        }

        $this->_yesno_fields_by_instrument[$instrument_name]
            = array_values(array_unique($yesno_fields));

        return $this->_yesno_fields_by_instrument[$instrument_name];
    }

    /**
     * Normalize raw REDCap values for yes/no fields to LORIS select values.
     *
     * REDCap `yesno` exports as raw 1/0 values. LORIS yes/no elements use
     * `yes`/`no` option keys.
     *
     * @param array  $instrument_values Instrument values.
     * @param string $instrument_name   REDCap instrument name.
     *
     * @return array The normalized values.
     */
    private function _normalizeYesNoFieldValues(
        array $instrument_values,
        string $instrument_name
    ): array {
        $yesno_fields = $this->_getYesNoFieldNames($instrument_name);

        foreach ($yesno_fields as $field_name) {
            if (!array_key_exists($field_name, $instrument_values)) {
                continue;
            }

            if ($instrument_values[$field_name] === '1'
                || $instrument_values[$field_name] === 1
            ) {
                $instrument_values[$field_name] = 'yes';
            } elseif ($instrument_values[$field_name] === '0'
                || $instrument_values[$field_name] === 0
            ) {
                $instrument_values[$field_name] = 'no';
            }
        }

        return $instrument_values;
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
        RedcapRecord $record,
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

        // REDCap yes/no is exported as raw 1/0 values.
        $instrument_values = $this->_normalizeYesNoFieldValues(
            $instrument_values,
            $instrument_name,
        );

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
}
