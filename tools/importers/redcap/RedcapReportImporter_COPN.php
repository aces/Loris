<?php
/**
 * This file contains code to import REDCap data into LORIS
 *
 * PHP 8
 *
 * @category Main
 * @package  Main
 * @author   Zaliqa Rosli <zaliqa.rosli@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
require_once __DIR__ . '/../../generic_includes.php';
require_once __DIR__ . '/../../../php/libraries/SwaggerClient-php/vendor/autoload.php';

namespace \LORIS\redcap\Importers;

use LORIS\StudyEntities\Candidate\CandID;

$project     = 'COPN';
$exportLabel = true;
$Runner      = new RedcapReportImporter_COPN($lorisInstance, $exportLabel, $project);
$Runner->run();

/**
 * This file contains code to import records from a REDCap report into LORIS
 *
 * PHP 8
 *
 * @category Main
 * @package  Main
 * @author   Zaliqa Rosli <zaliqa.rosli@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class RedcapReportImporter_COPN extends RedcapReportImporter 
{
    var $consent_method_field;

    /**
     * Create new instance.
     *
     * @param \LORIS\LorisInstance $loris       The LORIS instance that data is being
     *                                          imported from.
     * @param bool                 $exportLabel The export label boolean
     */
    function __construct(\LORIS\LorisInstance $loris, bool $exportLabel = false, string $project)
    {
        parent::__construct($loris, $exportLabel, $project);

        $this->consent_method_field = 'method_consent';
    }

    /**
     * Update candidate instrument data
     *
     * @param array $records Array of REDCap records
     *
     * @return array $new_data Array of instrument data imported
     */
    function updateCandidateData(array $records) : array
    {
        $new_data = [];
        
        print "\nProcessing instruments...\n";
        // record is at the visit level i.e. redcap_event_name
        foreach ($records as $row) {
            $mapping = $this->getRedcapReportFieldMapping();
            $pscid   = $row[$mapping['pscid']];

            // Check if candidate exists
            if (!$this->candidateExists($pscid)) {
                continue;
            }

            print "\n\tCandidate $pscid:\n";
            $cand_id = $this->getCandidateID($pscid);
            if ($cand_id === null) {
                $error_message = "Getting candidate ID for $pscid failed.";
                print "\t\t$error_message\n";
                $this->errors[$pscid][] = $error_message;
                continue;
            }

            $visit = $this->getLorisVisitMapping($row[$mapping['visit']]);

            // Check if visit exists first
            if (!$this->visitExists($cand_id, $visit)) {
                $error_message = "Visit $visit doesn't exist for candidate $pscid.";
                print "\t\t$error_message\n";
                $this->errors[$pscid][] = $error_message;
                continue;
            }
            // Check if visit has started before importing data, start visit if not
            $candidate_visit = $this->getCandidateVisit($cand_id, $visit);
            if (empty($candidate_visit['stages'])) {
                // Validate start visit
                if (!$this->validateVisitStart($row)) {
                    $error_message = "Cannot start visit $visit for candidate $pscid: date_visit missing or invalid.";
                    print "\t\t$error_message\n";
                    $this->errors[$pscid][] = $error_message;
                    continue;
                }
                // Start the visit
                $date_visit = $row[$mapping['date_visit'][0]] ?:
                              $row[$mapping['date_visit'][1]] ?:
                              $row[$mapping['date_visit'][2]];
                if (!$this->startVisit($candidate_visit, $date_visit)) {
                    print "\t\tVisit $visit NOT started for candidate $pscid.";
                    $this->errors[$pscid][] = "Starting visit $visit for candidate $pscid failed.";
                    continue;
                }
                print "\t\tVisit $visit successfully started for candidate $pscid.\n";
            }

            // Process instrument data
            // Get visit's instrument list
            $instrument_list = $this->getCandidateTestBattery($cand_id, $visit);
            if (is_null($instrument_list)) {
                print "\t\tCandidate $pscid has no instruments in the $visit test battery.\n";
                $this->errors[$pscid][] = "Unable to save instrument data for candidate $pscid: No instruments populated in the $visit test battery.";
                continue;
            }


            $raw_event = $this->getRedcapVisitMapping($row[$mapping['visit']]);
            $complete  = $row[$mapping['complete']];
            $site      = $this->getVisitSite($cand_id, $visit);

            foreach($instrument_list as $instrument) {
                print "\n\t\tInstrument $instrument:\n";

                // Handle instruments where name is different in REDCap and LORIS
                $redcap_instrument_name = $instrument;
                if ($instrument === 'covid19_questionnaire_redcap') {
                    $redcap_instrument_name = 'covid19_questionnaire';
                }

                // Get LORIS and REDCap instrument data
                // TO-DO: check if redcap_data is null?
                // TO-DO: check if loris_data is null?
                // TO-DO: check if flags data is null?
                $redcap_data = $this->getRedcapInstrumentData($pscid, $raw_event, $redcap_instrument_name);
                $loris_data  = $this->getLorisInstrumentData($cand_id, $visit, $instrument);
                $flags_data  = $this->getLorisFlagsData($cand_id, $visit, $instrument);

                // Get values to save for LORIS metadata fields: administration and validity flags, examiner_id, date_taken
                $administration_flag = $this->getAdministrationFlag($redcap_data, $redcap_instrument_name);
                $validity_flag       = $this->getValidityFlag($complete);
                $examiner_id         = null;
                $date_taken          = '';

                // Get examiner field from redcap data and validate if in LORIS
                $redcap_examiner = '';
                $examiner_field  = $this->getRedcapExaminerField($instrument);

                // If available, set Examiner's name from 'who administered' REDCap field
                // If field not available, set "N/A"
                // If field available, but no data, leave as ""
                // If field available, but doesn't exist in redcap data, throw error
                if ($examiner_field === null) {
                    $redcap_examiner = "N/A";
                } else {
                    // extract value from recap_data
                    if (!isset($redcap_data[$examiner_field])) {
                        print "\n\t\t\tField $examiner_field not found in REDCap data. No Examiner data available.";
                        print "\n\t\t\tSkipping saving $instrument data for $pscid at $visit.\n\n";
                        $error_message = "$pscid $visit $instrument: Examiner field $examiner_field does not exist in REDCap data.";
                        $this->errors[$pscid][] = $error_message;
                        // print to output
                        fwrite(STDERR, $error_message . PHP_EOL);
                        continue;
                    }

                    $redcap_examiner = $redcap_data[$examiner_field];
                }

                // Get LORIS examiner_id from redcap_examiner name
                if ($redcap_examiner === '') {
                    // $examiner_id remains null, examiner field won't be saved.
                } else {
                    // Check examiner name exists in LORIS
                    if (!$this->examinerExistsAtSite($redcap_examiner, $site)) {
                        print "\n\t\t\tExaminer $redcap_examiner at site $site does not exist.";
                        print "\n\t\t\tSkipping saving $instrument data for $pscid at $visit.\n\n";
                        $error_message = "$pscid $visit $instrument: Examiner $redcap_examiner at site $site does not exist in LORIS.";
                        $this->errors[$pscid][] = $error_message;
                        // print to output
                        fwrite(STDERR, $error_message . PHP_EOL);
                        continue;
                    }

                    try {
                        $examiner_id = $this->getExaminerID($redcap_examiner);
                    } catch (Exception $e) {
                        $error_message = "Exception when querying examinerID for $redcap_examiner: ";
                        print "\n\t\t\t$error_message: " . $e->getMessage() . PHP_EOL;
                        print "\n\t\t\tSkipping saving $instrument data for $pscid at $visit.\n\n";
                        $this->errors[$pscid][] = $error_message . $e->getMessage();
                        // print to output
                        fwrite(STDERR, $error_message . $e->getMessage() . PHP_EOL);
                        continue;
                    }
                }

                // Get date_taken field from redcap data and format
                $date_taken_field = $this->getRedcapDateTakenField($instrument);

                if ($date_taken_field === null) {
                    print "\n\t\t\tDate_taken equivalent field not found in REDCap data. No Date_taken data available.\n";
                    print "\n\t\t\tSkipping saving $instrument data for $pscid at $visit.\n\n";
                    $error_message = "$pscid $visit $instrument: Date_taken field equivalent does not exist in REDCap data.";
                    $this->errors[$pscid][] = $error_message;
                    // print to output
                    fwrite(STDERR, $error_message . PHP_EOL);
                    continue;
                }
                
                if (!isset($redcap_data[$date_taken_field])) {
                    print "\n\t\t\tField $date_taken_field not found in REDCap data. No Date_taken data available.";
                    print "\n\t\t\tSkipping saving $instrument data for $pscid at $visit.\n\n";
                    $error_message = "$pscid $visit $instrument: Date_taken field $date_taken_field does not exist in REDCap data.";
                    $this->errors[$pscid][] = $error_message;
                    // print to output
                    fwrite(STDERR, $error_message . PHP_EOL);
                    continue;
                }

                $date_taken = $redcap_data[$date_taken_field];

                if ($date_taken !== '' && strtotime($date_taken) !== false) {
                    $date_taken = new \DateTime($date_taken);
                    if (!$this->isQPNSite($site)) {
                        // reformat Date_taken to YYYY-MM-01, scrubbing day
                        $date_taken = $this->scrubDayinDate($date_taken);
                    }
                    $date_taken = $date_taken->format('Y-m-d');
                }


                // Get instrument data from redcap records

                // Unset completion field from redcap data as it doesn't exist in LORIS
                // and so doesn't need to be saved
                unset($redcap_data[$redcap_instrument_name . '_complete']);

                // For each field, PATCH data iff value is different to LORIS instrument data value.
                $instrument_data = [];
                foreach ($redcap_data as $key => &$value) {
                    $fieldname     = $key;
                    $isMultiSelect = false;

                    // check if field is an ignored field and skip over
                    if (in_array($fieldname, $this->fields_to_ignore)) {
                        continue;
                    }

                    // check if field is a QPN only field
                    // and skip over if candidate is from non-QPN site
                    if (in_array($fieldname, $this->qpn_fields) &&
                        !$this->isQPNSite($site)
                    ) {
                        continue;
                    }

                    // handle multiselect, extract LORIS fieldname from REDCap fieldname
                    if (strpos($fieldname, "___") !== false) {
                        $isMultiSelect = true;
                        $fieldname     = substr($fieldname, 0, strpos($fieldname, "___"));
                    }

                    // if fieldname includes '_status', map to fieldname in LORIS (without "_status")
                    if (strpos($fieldname, "_status") !== false) {
                        if ($mapped_fieldname = $this->mapFieldsWithStatusInName($fieldname)) {
                            $fieldname = $mapped_fieldname;
                        }
                    }

                    // check if field doesn't exist in loris
                    if (!array_key_exists($fieldname, $loris_data)) {
                        $fieldValPair = [
                            'instrument' => $instrument,
                            'field'      => $fieldname,
                        ];
                        if (!in_array($fieldValPair, $this->missing_fields)) {
                            $error_message = "Field $fieldname does not exist in LORIS.\n";
                            print "\n\t\t\t$error_message";
                            $this->missing_fields[] = $fieldValPair;
                            // print to output
                            fwrite(STDERR, $error_message . PHP_EOL);
                        }
                        continue;
                    }

                    // if field is a COPN date field, reformat to YYYY-MM-01 (scrub day), even if data is QPN data
                    if ((strpos($fieldname, 'date') !== false || in_array($fieldname, $this->dates_to_scrub))
                        && !in_array($fieldname, $this->qpn_fields)
                    ) {
                        $newValue = '';
                        if (!empty($value) && strtotime($value) !== false) {
                            $newValue = $this->scrubDayinDate(new \DateTime($value))->format('Y-m-d');
                        }

                        $value = $newValue;
                    }

                    // Compare values between REDCap and LORIS
                    if ($isMultiSelect) {
                        // Process REDCap values, $key   == [$fieldname___$multiValue]
                        //                        $value == 1 or 0
                        $multiValue     = substr($key, (strpos($key, "___")+3));
                        $multiIsChecked = $value;

                        // Process LORIS values
                        // remove all NULL, FALSE and Empty Strings but leave 0 values
                        $valueArr = array_filter(explode("{@}", $loris_data[$fieldname]), 'strlen');

                        // if field not checked, make sure not in LORIS
                        // if field is checked, make sure in LORIS
                        if (!$multiIsChecked) {
                            if (!in_array($multiValue, $valueArr)) {
                                continue;
                            }
                            // Remove value from LORIS
                            $keyInArray = array_search($multiValue, $valueArr);
                            unset($valueArr[$keyInArray]);
                        } else {
                            if (in_array($multiValue, $valueArr)) {
                                continue;
                            }
                            // save value to LORIS
                            array_push($valueArr, $multiValue);
                        }

                        // Save new value to loris_data so that it isn't
                        // lost in the next iteration
                        $loris_data[$fieldname] = implode("{@}", $valueArr);

                        // Set instrument data value as array
                        // Let instrument _saveValues handle implode with "{@}"
                        $instrument_data[$fieldname] = $valueArr;
                    } else {
                        // If value in LORIS DB and REDCap are the same, do nothing
                        if ($value == htmlspecialchars_decode($loris_data[$fieldname])) {
                            continue;
                        }
                        if (empty($value) && !is_numeric($value)) {
                            // Set value as ''
                            $instrument_data[$fieldname] = '';
                            if (array_key_exists($fieldname.'_status', $loris_data)) {
                                // if field doesn't have value, set $fieldname_status to 'not_answered'
                                $instrument_data[$fieldname.'_status'] = 'not_answered';
                            }
                        } else {
                            // Set value as $value
                            $instrument_data[$fieldname] = $value;
                        }
                    }
                }

                // Save LORIS metadata field values examiner_id, date_taken first, then instrument data, then flags

                // Save examiner
                if ($examiner_id !== null &&
                    $examiner_id != htmlspecialchars_decode($loris_data['Examiner'])
                ) {
                    if ($this->setInstrumentData(
                            $cand_id,
                            $visit,
                            $instrument,
                            ['Examiner' => $examiner_id],
                            $this->lorisApiConfig
                        )
                    ) {
                        print "\t\t\tSaved to Examiner\n";
                        $new_data[$pscid][$visit][$instrument]['Examiner'] = $examiner_id;
                    }
                }

                // Save Date_taken
                if ($date_taken !== '' &&
                    $date_taken != htmlspecialchars_decode($loris_data['Date_taken'])
                ) {
                    if ($this->setInstrumentData(
                            $cand_id,
                            $visit,
                            $instrument,
                            ['Date_taken' => $date_taken],
                            $this->lorisApiConfig
                        )
                    ) {
                        print "\t\t\tSaved to Date_taken\n";
                        $new_data[$pscid][$visit][$instrument]['Date_taken'] = $date_taken;
                    }
                }

                // SAVE INSTRUMENT DATA
                if (!empty($instrument_data)) {
                    if ($this->setInstrumentData(
                            $cand_id,
                            $visit,
                            $instrument,
                            $instrument_data,
                            $this->lorisApiConfig
                        )
                    ) {
                        foreach ($instrument_data as $fieldSaved => $valueSaved) {
                            print "\t\t\tSaved to $fieldSaved\n";
                        }
                        $instrument_new_data = $new_data[$pscid][$visit][$instrument] ?? array();
                        $new_data[$pscid][$visit][$instrument] = array_merge($instrument_new_data, $instrument_data);
                    }
                } else {
                    print "\t\t\tNo instrument data to save.\n";
                }

                // Save Administration flag
                // Once flag is set in LORIS DB, cannot patch to NULL with API
                if ($administration_flag !== null &&
                    $administration_flag != $flags_data['administration']
                ) {
                    if ($this->setInstrumentAdministrationFlag(
                            $cand_id,
                            $visit,
                            $instrument,
                            $administration_flag,
                            $this->lorisApiConfig
                        )
                    ) {
                        print "\n\t\t\tSaved Administration flag\n";
                        $new_data[$pscid][$visit][$instrument]['Administration'] = $administration_flag;
                    }
                }

                // Save Validity flag
                // Once flag is set in LORIS DB, cannot patch to NULL with API
                if ($validity_flag !== null &&
                    $validity_flag != $flags_data['validity']
                ) {
                    if ($this->setInstrumentValidityFlag(
                            $cand_id,
                            $visit,
                            $instrument,
                            $validity_flag,
                            $this->lorisApiConfig
                        )
                    ) {
                        print "\n\t\t\tSaved Validity flag\n";
                        $new_data[$pscid][$visit][$instrument]['Validity'] = $validity_flag;
                    }
                }
            }
        }

        return $new_data;
    }

    /**
     * Checks if candidate exists by its id
     *
     * @param $id The candidate id, the PSCID or DCCID
     *
     * return bool True if candidate exists
     */
    function candidateExists(string $id) : bool
    {
        return $this->getCandidate($id) ? true : false;
    }

    /**
     * Checks if visit exists by its visit label and cand id
     *
     * @param $dccid       The candidate id, DCCID
     * @param $visit_label The visit label
     *
     * return bool True if visit exists
     */
    function visitExists(string $dccid, string $visit_label) : bool
    {
        return $this->getCandidateVisit($dccid, $visit_label) ? true : false;
    }

    /**
     * Get candidate visit
     *
     * @param string $dccid The candidate id, DCCID
     * @param string $visit The visit label
     *
     * return ?\Swagger\Client\Model\InlineResponse2003 The visit object
     */
    function getCandidateVisit(string $dccid, string $visit) : ?\Swagger\Client\Model\InlineResponse2003
    {
        try {
            $apiInstance = new Swagger\Client\Api\VisitApi(
                $this->httpClient,
                $this->lorisApiConfig
            );
            $result = $apiInstance->candidatesIdVisitGet($dccid, $visit);
        } catch (Exception $e) {
            // Returns 404 if not found
            return null;
        }

        if (empty($result) || is_null($result)) {
            return null;
        }
    
        return $result;
    }

    /**
     * Validates a REDCap record row for all fields required
     * to create a candidate in LORIS
     *
     * @param array $row The REDCap record row
     *
     * @return bool True if $row has all the required fields,
     *                   dob, project, pscid, site, sex
     */
    function validateCandidateCreate(array $row) : bool
    {
        $mapping = $this->getRedcapReportFieldMapping();

        // site_2 is required if site is QPN/RPQ
        if (!isset($row[$mapping['dob']]) || $row[$mapping['dob']] === '' || strtotime($row[$mapping['dob']]) === false) {
            return false;
        } else if (!isset($row[$mapping['site'][0]]) || !isset($row[$mapping['site'][1]])) {
            return false;
        } else if ($row[$mapping['site'][0]] === '') {
            return false;
        } else if ($row[$mapping['site'][0]] === 'QPN/RPQ' && $row[$mapping['site'][1]] === '') {
            return false;
        } else if (!isset($row[$mapping['sex']]) || $row[$mapping['sex']] === '') {
            return false;
        }

        return true;
    }

    /**
     * Validates a REDCap record row for all fields required
     * to create a visit in LORIS
     *
     * @param array $row The REDCap record row
     *
     * @return bool True if $row has all the required fields,
     *                   subproject
     */
    function validateVisitCreate(array $row) : bool
    {
        $mapping = $this->getRedcapReportFieldMapping();

        $subproject = $row[$mapping['subproject']] ?? '';
        if ($subproject === '') {
            return false;
        } else if (!isset($this->getLorisSubprojectMapping()[$subproject])) {
            return false;
        }

        return true;
    }

    /**
     * Validates a REDCap record row for all fields required
     * to start a visit in LORIS
     *
     * @param array $row The REDCap record row
     *
     * @return bool True if $row has all the required fields,
     *              date_visit
     */
    function validateVisitStart(array $row) : bool
    {
        $mapping = $this->getRedcapReportFieldMapping();

        $date_visit = $row[$mapping['date_visit'][0]] ?:
                      $row[$mapping['date_visit'][1]] ?:
                      $row[$mapping['date_visit'][2]] ?? '';

        if ($date_visit === '' || strtotime($date_visit) === false) {
            return false;
        }

        return true;
    }

    /**
     * Checks if site is a QPN site
     *
     * @param $site The site name
     *
     * return bool True if the site is a QPN site
     */
    function isQPNSite($site) : bool
    {
        if ($site === 'Montreal Neurological Institute' ||
            $site === 'CHU Quebec' ||
            $site === 'CHU Montreal' ||
            $site === 'Clinique Neuro-Lévis'
        ) {
            return true;
        }

        return false;
    }

    /**
     * Starts a visit with Not Started stage
     *
     * @param \Swagger\Client\Model\InlineResponse2003 $visit      The visit object with properties
     * @param string                                   $date_visit The date of visit
     *
     * @return bool True if the visit succesfully started
     */
    function startVisit(\Swagger\Client\Model\InlineResponse2003 $visit, string $date_visit) : bool
    {
        $date_visit = new \DateTime($date_visit);

        $cand_id     = $visit['meta']['cand_id'];
        $visit_label = $visit['meta']['visit'];
        $site        = $visit['meta']['site'];
        $battery     = $visit['meta']['battery']; 

        // QPN sites - don't scrub day but make sure
        // date is properly formatted for DB
        $date_visit = $this->isQPNSite($site) ? $date_visit->format('Y-m-d') : $this->scrubDayinDate($date_visit)->format('Y-m-d');

        // Start visit
        // Swagger-php docs for VisitPatchFields model is missing
        // properties from VisitMetaFields, but VisitPatchFields
        // model lib correctly extends VisitMetaFields
        $body = new \Swagger\Client\Model\VisitPatchFields([
            'cand_id' => $cand_id,
            'visit'   => $visit_label,
            'site'    => $site,
            'battery' => $battery,
            'project' => $this->project,
            'stages'  => new \Swagger\Client\Model\InstrumentVisit([
                'visit' => new \Swagger\Client\Model\VisitStage([
                    'date'   => $date_visit,
                    'status' => 'In Progress',
                ])
            ])
        ]);
    
        try {
            $apiInstance = new Swagger\Client\Api\VisitApi($this->httpClient, $this->lorisApiConfig);
            $apiInstance->candidatesIdVisitPatch($cand_id, $visit_label, $body);
        } catch (Exception $e) {
            return false;
        }
    
        return true;
    }

    /**
     * Update specific candidate's consent method value
     *
     * @param string $cand_id                   The candidate id, the DCCID
     * @param string $consent_method_options_id The consent method options ID
     * @param string $consent_method_id         The consent method ID
     * @param bool   $update                    True if candidate consent_method already exists in LORIS,
     *                                          and needs to be updated. False if consent is new,
     *                                          and needs saving.
     *
     * return bool True if successful
     */
    function updateConsentMethod(
        string $cand_id,
        string $consent_method_options_id,
        string $consent_method_id,
        bool   $update
    ) : bool
    {
        $update_consent_method = [
            'CandidateID'            => $cand_id,
            'ConsentMethodID'        => $consent_method_id,
            'ConsentMethodOptionsID' => $consent_method_options_id,
        ];

        // If consent method already exists, check value and update if data is different
        if ($update) {
            try {
                $this->DB->update(
                    'candidate_consent_method_rel',
                    $update_consent_method,
                    [
                        'CandidateID'     => $cand_id,
                        'ConsentMethodID' => $consent_method_id,
                    ]
                );
            } catch (Exception $e) {
                return false;
            }
        } else {
            // then, insert
            try {
                $this->DB->insert('candidate_consent_method_rel', $update_consent_method);
            } catch (Exception $e) {
                return false;
            }
        }

        return true;
    }

    /**
     * Update specific candidate's consent data
     *
     * @param string    $cand_id           The candidate id, the DCCID
     * @param string    $pscid             The candidate id, the PSCID
     * @param string    $consent_id        The consent id
     * @param string    $consent_name      The consent name
     * @param string    $consent_label     The consent label
     * @param string    $consent_status    The REDCap consent status
     * @param \DateTime $consent_date      The REDCap consent date
     * @param string    $consenter_name    The REDCap consenter's name
     * @param bool      $update            True if candidate consent already exists in LORIS,
     *                                     and needs to be updated. False if consent is new,
     *                                     and needs saving.
     *
     * return ?array The update_consent_rel array, or null if consent didn't update
     */
    function updateConsent(
        string $cand_id,
        string $pscid,
        string $consent_id,
        string $consent_name,
        string $consent_label,
        string $consent_status,
        string $consent_date,
        string $consenter_name,
        bool   $update
    ) : ?array {
        // Prepare data array
        $update_consent_rel = [
            'CandidateID'   => $cand_id,
            'ConsentID'     => $consent_id,
            'Status'        => $consent_status,
            'DateGiven'     => $consent_date,
            'DateWithdrawn' => null,
        ];

        // Prepare history array
        $update_consent_history = [
            'PSCID'         => $pscid,
            'ConsentName'   => $consent_name,
            'ConsentLabel'  => $consent_label,
            'Status'        => $consent_status,
            'DateGiven'     => $consent_date,
            'DateWithdrawn' => null,
            'EntryStaff'    => $consenter_name,
        ];

        if ($update) {
            try {
                $this->DB->update(
                    'candidate_consent_rel',
                    $update_consent_rel,
                    [
                        'CandidateID' => $cand_id,
                        'ConsentID'   => $consent_id,
                    ]
                );
                $this->DB->insert('candidate_consent_history', $update_consent_history);
            } catch (Exception $e) {
                return null;
            }
        } else {
            // then, insert
            try {
                $this->DB->insert('candidate_consent_rel', $update_consent_rel);
                $this->DB->insert('candidate_consent_history', $update_consent_history);
            } catch (Exception $e) {
                return null;
            }
        }

        return $update_consent_rel;
    }

    /**
     * Get REDCap consent date field by given consent name
     *
     * @param string $consent_name The name of the consent, or
     *                              '' if not given
     *
     * @return string The name of the consent date field
     */
    function getConsentDateFieldByConsent(string $consent_name = '') : string
    {
        if ($consent_name === 'loris_consent') {
            return 'loris_consent_date';
        }
        if ($consent_name === 'covid_cosent') {
            return 'consent_covid_date';
        }

        // Else default to 'date0'
        return 'date0';
    }

    /**
     * Get REDCap consenter name field by given consent name
     *
     * @param string $consent_name The name of the consent
     *
     * @return ?string The name of the consenter field
     */
    function getConsenterFieldByConsent(string $consent_name) : ?string
    {
        if ($consent_name === 'covid_cosent') {
            return 'covid_consent_name';
        }

        return null;
    }


    /**
     * Gets the list of instruments in the candidate's visit's test battery
     *
     * @param string $cand_id The candidate id, the DCCID
     * @param string $visit   The visit label
     *
     * return ?array The list of instruments
     */
    function getCandidateTestBattery($cand_id, $visit) : ?array
    {
        $apiInstance = new Swagger\Client\Api\InstrumentsApi(
            $this->httpClient,
            $this->lorisApiConfig
        );

        $result = $apiInstance->candidatesIdVisitInstrumentsGet($cand_id, $visit)['instruments'];

        if (empty($result) || is_null($result)) {
            return null;
        }
    
        return $result;
    }

    /*
     * Get candidate instrument administration flag from REDCap data.
     * In REDCap, 2=Complete, 1=Unverified, 0=Incomplete
     *
     * @param array  $data       The redcap data
     * @param string $instrument The instrument name
     *
     * return ?string The instrument adminstration flag
     */
    function getAdministrationFlag(array $data, string $instrument) : ?string
    {
        $complete_field = $instrument . '_complete';

        switch ($data[$complete_field]) {
            case '0':
              return 'None';
            case '1':
              return 'Partial';
            case '2':
              return 'All';
        }

        return null;
    }

    /*
     * Get candidate instrument validity flag from REDCap data.
     *
     * @param string $complete The redcap data complete field value
     *
     * return ?string The instrument validity flag, return 'Valid' if
     *                complete field value is 'Complete'
     */
    function getValidityFlag(string $complete) : ?string
    {
        return ($complete === 'Complete') ? 'Valid' : null;
    }

    /**
     * Create new candidate
     *
     * @param string $project Project
     * @param string $pscid   PSCID
     * @param string $site    Site
     * @param string $do_b    Date of birth
     * @param string $sex     Sex
     *
     * @return ?\Swagger\Client\Model\Candidate $result The created candidate object
     */
    function createCandidate(
        string                       $project,
        string                       $pscid,
        string                       $site,
        string                       $do_b,
        string                       $sex
    ) : ?\Swagger\Client\Model\Candidate
    {
        $apiInstance = new Swagger\Client\Api\CandidatesApi(
            $this->httpClient,
            $this->lorisApiConfig
        );
    
        $candidate = new \Swagger\Client\Model\NewCandidateCandidate([
            'project' => $project,
            'pscid'   => $pscid,
            'site'    => $site,
            'do_b'    => $do_b,
            'sex'     => $sex,
        ]);
    
        $body = new \Swagger\Client\Model\NewCandidate([
            'candidate' => $candidate
        ]);
    
        $result = null;
        try {
            $result = $apiInstance->candidatesPost($body);
        } catch (Exception $e) {
            print "\nException when calling CandidatesApi->candidatesPost on $pscid: " . $e->getMessage() . PHP_EOL;
            return null;
        }

        if (empty($result) || is_null($result)) {
            return null;
        }
    
        return $result;
    }
    
    /**
     * Create new visit
     *
     * @param string $candid     DCCID
     * @param string $visit      Visit
     * @param string $site       Site
     * @param string $subproject Subproject
     * @param string $project    Project
     *
     * @return ?\Swagger\Client\Model\InlineResponse2003 $result The created visit object
     */
    function createVisit(
        string                      $candid,
        string                      $visit,
        string                      $site,
        string                      $subproject,
        string                      $project
    ) : ?\Swagger\Client\Model\InlineResponse2003
    {
        $apiInstance = new Swagger\Client\Api\VisitApi(
            $this->httpClient,
            $this->lorisApiConfig
        );

        $body = new \Swagger\Client\Model\VisitMetaFields([
            'cand_id' => $candid,
            'visit'   => $visit,
            'site'    => $site,
            'battery' => $subproject,
            'project' => $project,
        ]);
    
        try {
            $apiInstance->candidatesIdVisitPut($candid, $visit, $body);
        } catch (Exception $e) {
            print "\nException when calling VisitApi->candidatesIdVisitPut: " . $e->getMessage() . PHP_EOL;
            return null;
        }
    
        // Because candidatesIdVisitPut returns void,
        // check that the timepoint was created, and return result
        return $this->getCandidateVisit($candid, $visit);
    }
    
    /**
     * Checks if an examiner name exists in the LORIS DB
     * at a given site
     *
     * @param string $examiner The examiner name
     * @param string $site     The site at which the examiner is registered
     *
     * return bool True if the examiner exists
     */
    function examinerExistsAtSite(string $examiner, string $site) : bool
    {
        $examiner_id  = $this->getExaminerID($examiner);

        if ($examiner_id === null) {
            return false;
        }

        $count = $this->DB->pselectOneInt(
            "SELECT COUNT(*) FROM examiners_psc_rel epr
                LEFT JOIN psc ON (epr.centerID=psc.CenterID)
              WHERE epr.examinerID=:examiner_id
                AND psc.Name=:site_name",
            [
                'examiner_id' => $examiner_id,
                'site_name'   => $site,
            ]
        );
    
        if ($count < 1 || $count === null) {
            return false;
        }
    
        return true;
    }
    
    /**
     * Gets a candidate's site
     *
     * @param $id The candidate id, PSCID or DCCID
     *
     * @return ?string The candidate site
     */
    function getCandidateSite(string $id) : ?string
    {
        return  $this->getCandidate($id)['meta']['site'] ?? null;
    }

    /**
     * Gets a visit's site
     *
     * @param $dccid The candidate id, DCCID
     * @param $visit The visit label
     *
     * @return ?string The visit's site
     */
    function getVisitSite(string $dccid, string $visit) : ?string
    {
        return $this->getCandidateVisit($dccid, $visit)['meta']['site'] ?? null;
    }

    /**
     * Gets candidate object
     *
     * @param $id The candidate id, DCCID or PSCID
     *
     * @return ?\Swagger\Client\Model\InlineResponse2002
     */
    function getCandidate(string $id) : ?\Swagger\Client\Model\InlineResponse2002
    {
        try {
            $api = new Swagger\Client\Api\CandidatesApi(
                $this->httpClient,
                $this->lorisApiConfig
            );
            $result = $api->candidatesIdGet($id);
        } catch (Exception $e) {
            // Case if candidate is inactive but in DB, return null
            return null;
        }

        return empty($result) ? null : $result;
    }

    /**
     * Gets a candidate's dccid
     *
     * @param $pscid The candidate pscid
     *
     * @return ?string The candidate dccid
     */
    function getCandidateID(string $pscid) : ?string
    {
        $candidate = $this->getCandidate($pscid);

        return $candidate['meta']['cand_id'] ?? null;
    }

    /**
     * Get examiner ID for given examiner name in LORIS DB
     *
     * @param $examiner The examiner name
     *
     * return ?string The examiner id
     */
    function getExaminerID(string $examiner) : ?string
    {
        $examinerID = $this->DB->pselect(
            "SELECT examinerID
             FROM examiners
             WHERE full_name=:examiner",
            ['examiner' => $examiner]
        );
    
        if (count($examinerID) > 1) {
          throw new Exception('More than 1 examiner ID for ' . $examiner);
        }
    
        return $examinerID[0]['examinerID'] ?? null;
    }

    /**
     * Get Consent List by Consent Group Name
     *
     * @param string $group Consent group name
     *
     * @return array An associative array of consents, with their names,
     *               labels, and consent ID, for the given consent group.
     *               The keys of the arrays are the IDs of the consents.
     */
    function getConsentListByGroup(string $group) : array {
        $query        = "SELECT c.ConsentID AS ConsentID, c.Name AS Name, c.Label AS Label FROM consent c
            LEFT JOIN consent_group cg USING (ConsentGroupID)
            WHERE cg.Name=:consent_group";
        $where        = array('consent_group' => $group);
        $key          = 'ConsentID';
    
        $result = $this->DB->pselectWithIndexKey($query, $where, $key);
    
        return $result;
    }
    
    function scrubDayinDate(\DateTime $datetime) : \DateTime {
       $year  = $datetime->format('Y');
       $month = $datetime->format('m');
    
       return $datetime->setDate($year, $month, 1);
    }
}
?>
