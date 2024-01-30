<?php declare(strict_types=1);

require_once __DIR__ . '/../../../php/libraries/SwaggerClient-php/vendor/autoload.php';

include 'RedcapHttpClient.php';
include 'RedcapConfig.php';
include 'IRedcapImporter.php';

use \LORIS\LorisInstance;
use \GuzzleHttp\Client;

/**
 * This represents a REDCap importer
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
abstract class RedcapImporter implements IRedcapImporter
{
    var $loris;                // reference to the LorisInstance object
    var $DB;                   // reference to the database handler

    var $redcapClient;         // reference to the RedcapHttpClient object
    var $redcapConfig;         // reference to the RedcapConfig object

    var $lorisApiConfig;       // Swagger client configuration, use LORIS api where possible
    var $httpClient;

    var $errors         = [];  // error handling
    var $missing_fields = [];  // REDCap fields not in LORIS

    var $site_specific_fields; // only site candidates will have these field values imported
    var $dates_to_scrub;       // Specify date fields that don't have the string 'date' in the fieldname
    var $fields_to_ignore;     // REDCap fields to ignore and not import into LORIS

    var $project;

    private bool $exportLabel; // True or false export the Redcap records as label
                               // for multiple choice fields. If false, export raw values

    var $redcapDateRangeBegin; // Date string 'YYYY-MM-DD HH:MM:SS' after which REDCap records
                               // were created/modified
    var $redcapDateRangeEnd;   // Date string 'YYYY-MM-DD HH:MM:SS' before which REDCap records
                               // were created/modified
    /**
     * Create new instance.
     *
     * @param \LORIS\LorisInstance $loris          The LORIS instance that data is being
     *                                             imported from.
     * @param string               $project        The LORIS project to import for
     * @param bool                 $exportLabel    The export label boolean
     * @param ?string              $dateRangeBegin Date string 'YYYY-MM-DD HH:MM:SS' after which REDCap records were
     *                                             created or modified
     * @param ?string              $dateRangeEnd   Date string 'YYYY-MM-DD HH:MM:SS' before which REDCap records were
     *                                             created or modified
     */
    function __construct(
        \LORIS\LorisInstance $loris,
        string               $project,
        bool                 $exportLabel = false,
        ?string              $dateRangeBegin = null,
        ?string              $dateRangeEnd = null
    ) {
        $this->loris = $loris;
        $this->DB    = $this->loris->getDatabaseConnection();


        $this->redcapClient = new RedcapHttpClient($loris);
        $this->redcapConfig = new RedcapConfig($project);

        $this->httpClient     = new GuzzleHttp\Client();
        $settings             = $this->loris->getConfiguration()->getSetting('API');
        $this->lorisApiConfig = new Swagger\Client\Configuration();
        $this->lorisApiConfig = Swagger\Client\Configuration::getDefaultConfiguration()->setHost(
            $settings['url']
        );

        $this->lorisApiConfig = $this->loginApi(
            $this->lorisApiConfig,
            $settings['username'],
            $settings['password']
        );


        // Set up data field restrictions, specifications
        $this->site_specific_fields = $this->redcapConfig->getSiteSpecificFields();
        $this->dates_to_scrub       = $this->redcapConfig->getDatesToScrub();
        $this->fields_to_ignore     = $this->redcapConfig->getFieldsToIgnore();

        $this->project     = $project;
        $this->exportLabel = $exportLabel;

        $this->redcapDateRangeBegin = $dateRangeBegin;
        $this->redcapDateRangeEnd   = $dateRangeEnd;
    }

    /**
     * Login to the LORIS API
     *
     * @param Swagger\Client\Configuration $config   The LORIS api configuration
     * @param string                       $username The LORIS api username
     * @param string                       $password The LORIS api password
     *
     * @return Swagger\Client\Configuration The LORIS api configuration
     */
    public function loginApi(
        Swagger\Client\Configuration $config,
        string $username,
        string $password
    ): Swagger\Client\Configuration {
        $loginApiInstance = new Swagger\Client\Api\LoginApi(
            $this->httpClient,
            $config
        );

        $token = $loginApiInstance->loginPost(
            new \Swagger\Client\Model\Body(
                [
                    'username' => $username,
                    'password' => $password,
                ]
            )
        )->getToken();

        // Configure API key authorization: ApiKeyAuth
        $config = Swagger\Client\Configuration::getDefaultConfiguration()->setApiKey('Authorization', $token);
        $config = Swagger\Client\Configuration::getDefaultConfiguration()->setApiKeyPrefix('Authorization', 'Bearer');

        return $config;
    }

    /**
     * Runs the importer
     *
     * @return void
     */
    function run() : void
    {
        $records = $this->_fetchRecords();

        if ($records === null) {
            print "\nNo records to import.\n";
            return;
        }

        $new_candidates = $this->createNewCandidates($records);
        $new_visits     = $this->createNewVisits($records);
        $new_consents   = $this->updateCandidateConsents($records);
        $new_data       = $this->updateCandidateData($records);

        print "\nImport complete.\n";

        $this->createRunLog($new_candidates, $new_consents, $new_visits, $new_data);
    }

    /**
     * Fetches all records from REDCap
     *
     * @return ?array $records The array of records in the REDCap report
     */
    public function fetchRecords() : ?array
    {
        $NUM_OF_ATTEMPTS = 3;
        $attempts        = 0;
        $records         = null;

        do {
            try {
                $records = $this->redcapClient->_exportRecords(
                    null,
                    null,
                    null,
                    $this->exportLabel,
                    $this->redcapDateRangeBegin,
                    $this->redcapDateRangeEnd
                );
            } catch (Exception $e) {
                $attempts++;
                sleep(60);
                continue;
            }
            break;
        } while ($attempts < $NUM_OF_ATTEMPTS);

        return $records;
    }

    /**
     * Create new candidates
     *
     * @param array $records Array of REDCap records
     *
     * @return array $new_candidates Array of new candidates created
     */
    function createNewCandidates(array $records) : array
    {
        $new_candidates = [];
        $project        = $this->project;
        $mapping        = $this->getMetadataMapping();

        print "\nCreating candidates..\n\n";
        // record is at the visit level i.e. redcap_event_name
        foreach ($records as $row) {
            $pscid = $row[$mapping['pscid']];

            // If candidate already exists in LORIS, skip
            if ($this->candidateExists($pscid)) {
                continue;
            }

            $site = '';
            $dob  = '';
            $sex  = '';

            foreach ($mapping as $loris_field => $redcap_field) {

                $val = ''; // The redcap data point
                $var = ''; // The redcap variable name

                // If there are multiple REDCap fields for a given LORIS field,
                // use the first field in list with a non empty value
                if (is_array($redcap_field)) {
                    $var = current(
                        array_filter(
                            $redcap_field,
                            function ($i) use ($row) {
                                return isset($row[$i]) && strlen($row[$i]) != 0;
                            }
                        )
                    );
                } else {
                    $var = $redcap_field;
                }

                $val = $row[$var] ?? '';

                switch ($loris_field) {
                case 'site':
                    $site = $this->getSiteMapping()[$val] ?? '';
                    break;
                case 'dob':
                    $dob = $val;
                    // Format dob, and scrub if required
                    if (strtotime($dob) !== false) {
                        $dob = new \DateTime($dob);
                        if (array_key_exists($var, $this->dates_to_scrub)) {
                            $dob = $this->scrubDate(
                                $dob,
                                $this->dates_to_scrub[$var]['component']
                            )->format($this->dates_to_scrub[$var]['format']);
                        }
                    }
                    break;
                case 'sex':
                    $sex = $this->getSexMapping()[$val] ?? '';
                    break;
                }
            }

            // Validate create candidate values
            if ($pscid   === ''
                || $site    === ''
                || $sex     === ''
                || $project === ''
                || $dob     === ''
                || strtotime($dob) === false
            ) {
                print "\tCreating candidate $pscid failed.\n";
                $this->errors[$pscid][] = "Cannot create candidate $pscid: dob, project, pscid, site, or sex missing or invalid.";
                continue;
            }

            print "\tCreating candidate $pscid:\n";
            // creating candidate with invalid PSCID format should return error
            // creating candidate that already exists should also return error
            $new_cand = $this->createCandidate(
                $project,
                $pscid,
                $site,
                $dob,
                $sex
            );

            if (is_null($new_cand)) {
                print "\t\tCandidate $pscid NOT created.";
                $this->errors[$pscid][] = "Creating candidate $pscid failed.";
                continue;
            }

            print "\t\t201 Created candidate: $pscid\n";
            $new_candidates[$pscid] = $new_cand;
        }

        return $new_candidates;
    }

    /**
     * Create new visits
     *
     * @param array $records Array of REDCap records
     *
     * @return array $new_visits Array of new visits created
     */
    function createNewVisits(array $records) : array
    {
        $new_visits = [];
        $project    = $this->project;
        $mapping    = $this->getMetadataMapping();

        print "\nCreating visits..\n\n";
        // record is at the visit level i.e. redcap_event_name
        foreach ($records as $row) {
            $pscid = $row[$mapping['pscid']];

            // Check if candidate exists before attempting
            // to create visit
            if (!$this->candidateExists($pscid)) {
                continue;
            }

            // Get candidate id
            $dccid = $this->getCandidateID($pscid);
            if ($dccid === null) {
                $error_message = "Getting candidate ID for $pscid failed.";
                print "\t$error_message\n";
                $this->errors[$pscid][] = $error_message;
                continue;
            }

            // Get row visit label
            $visit = $this->getVisitMapping()[$row[$mapping['visit']] ?? ''] ?? '';
            if ($visit === '') {
                print "\tCreating visit " . $row[$mapping['visit']] . " for $pscid failed.\n";
                $this->errors[$pscid][] = "Cannot create visit " . $row[$mapping['visit']]
                                        . " for candidate $pscid: visit label invalid.";
                continue;
            }

            // If visit already exists in LORIS, skip
            if ($this->visitExists($dccid, $visit)) {
                continue;
            }

            // Get cohort value
            $cohort       = ''; // The redcap data point
            $cohort_field = ''; // The redcap variable name

            // If there are multiple REDCap fields for cohort,
            // use the first field in list with a non empty value
            $redcap_field = $mapping['cohort'];
            if (is_array($redcap_field)) {
                $cohort_field = current(
                    array_filter(
                        $redcap_field,
                        function ($i) use ($row) {
                            return isset($row[$i]) && strlen($row[$i]) != 0;
                        }
                    )
                );
            } else {
                $cohort_field = $redcap_field;
            }

            // If cohort data not available in REDCap row,
            // get candidate's most recent visit cohort in LORIS
            $cohort = $this->getCohortMapping()[$row[$cohort_field] ?? '']
                ?? \Candidate::singleton(new CandID($dccid))->getCohortForMostRecentVisit()['title']
                ?? '';

            // Validate create visit values
            if ($cohort === ''
                || $project === ''
            ) {
                $error_message = "Cannot create visit $visit for candidate $pscid: cohort missing or invalid.";
                print "\t$error_message\n";
                $this->errors[$pscid][] = $error_message;
                continue;
            }

            // Get candidate site
            $site = $this->getCandidateSite($pscid);

            print "\tCreating visit $visit for candidate $pscid:\n";
            $new_visit = $this->createVisit(
                $dccid,
                $visit,
                $site,
                $cohort,
                $project
            );

            if (is_null($new_visit)) {
                print "\t\tVisit $visit NOT created for candidate $pscid.";
                $this->errors[$pscid][] = "Creating visit $visit for candidate $pscid failed.";
                continue;
            }

            print "\t\t201 Created visit for candidate $pscid: $visit\n";
            $new_visits[] = $new_visit;
        }

        return $new_visits;
    }

    /**
     * Update candidate consent
     *
     * @param array $records Array of REDCap records
     *
     * @return array $new_consents Array of consent data imported
     */
    function updateCandidateConsents(array $records) : array
    {
        $new_consents    = [];
        $mapping         = $this->getMetadataMapping();
        $consent_mapping = $this->getConsentMapping();
        $consent_list    = $this->getConsentListByGroup($this->project);

        print "\nProcessing consent data...\n\n";
        foreach ($records as $row) {
            $pscid = $row[$mapping['pscid']];

            // Check if candidate exists
            if (!$this->candidateExists($pscid)) {
                continue;
            }

            $cand_id = $this->getCandidateID($pscid);
            if ($cand_id === null) {
                $error_message = "Getting candidate ID for $pscid failed.";
                print "\t$error_message\n";
                $this->errors[$pscid][] = $error_message;
                continue;
            }

            $candidate         = \Candidate::singleton(new CandID($cand_id));
            $candidate_consent = $candidate->getConsents();

            foreach ($consent_list as $consent_id => $consent) {
                $consent_name  = $consent['Name'];
                $consent_label = $consent['Label'];

                // Check if consent data is empty but not '0'
                if (empty($row[$consent_name]) && strlen($row[$consent_name]) == 0) {
                    // No consent information
                    continue;
                }

                // Redcap consent data, set consent values
                $consent_status = array_search(
                    $row[$consent_name],
                    $consent_mapping[$consent_name]['statusMapping']
                );
                $consent_date   = $row[$consent_mapping[$consent_name]['consentDateField']] ?? '';

                $consenter_field = $consent_mapping[$consent_name]['consenterField'] ?? null;
                $consenter_name  = ($consenter_field !== null  && !empty($row[$consenter_field]))
                                   ? $row[$consenter_field] . ' (REDCap)'
                                   : '(REDCap)';

                // Validate consent values
                if ($consent_status  === false
                    || $consent_date === ''
                    || strtotime($consent_date) === false
                ) {
                    $error_message = "Consent $consent_name status and/or date is missing or invalid for candidate $pscid. ";
                    print "\t$error_message\n";
                    $this->errors[$pscid][] = $error_message;
                    continue;
                }

                // Format dob, and scrub if required
                $consent_date       = new \DateTime($consent_date);
                $consent_date_field = $consent_mapping[$consent_name]['consentDateField'];
                if (array_key_exists(
                    $consent_date_field,
                    $this->dates_to_scrub
                )
                ) {
                    $consent_date = $this->scrubDate(
                        $consent_date,
                        $this->dates_to_scrub[$consent_date_field]['component']
                    )->format($this->dates_to_scrub[$consent_date_field]['format']);
                }

                // LORIS candidate consent data
                $candidate_consent_status = $candidate_consent[$consent_id]['Status'] ?? '';
                $candidate_consent_date   = $candidate_consent[$consent_id]['DateGiven'] ?? '';

                // only update consent data if data is different in REDCap and LORIS
                if (($consent_status == $candidate_consent_status)
                    && ($consent_date == $candidate_consent_date)
                ) {
                    continue;
                }

                $consent_exists = array_key_exists($consent_id, $candidate_consent);
                $consent_update = $this->updateConsent(
                    $cand_id,
                    $pscid,
                    $consent_id,
                    $consent_name,
                    $consent_label,
                    $consent_status,
                    $consent_date,
                    $consenter_name,
                    $consent_exists
                );

                if ($consent_update) {
                    print "\tConsent $consent_name updated for candidate $pscid.\n";
                    $new_consents[$pscid][$consent_name] = $consent_update;
                } else {
                    $error_message = "Consent $consent_name failed to be updated for candidate $pscid.";
                    print "\t$error_message\n";
                    $this->errors[$pscid][] = $error_message;
                }
            }
        }

        return $new_consents;
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
        $mapping  = $this->getMetadataMapping();

        print "\nProcessing instruments...\n";
        // record is at the visit level i.e. redcap_event_name
        foreach ($records as $row) {
            $pscid = $row[$mapping['pscid']];

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

            // Get row visit label
            $visit = $this->getVisitMapping()[$row[$mapping['visit']] ?? ''] ?? '';
            if ($visit === '') {
                print "\tCreating visit " . $row[$mapping['visit']] . " for $pscid failed.\n";
                $this->errors[$pscid][] = "Cannot create visit " . $row[$mapping['visit']]
                                        . " for candidate $pscid: visit label invalid.";
                continue;
            }

            // If visit doesn't exist, skip
            if (!$this->visitExists($cand_id, $visit)) {
                $error_message = "Visit $visit doesn't exist for candidate $pscid.";
                print "\t\t$error_message\n";
                $this->errors[$pscid][] = $error_message;
                continue;
            }

            // Check if visit has started before importing data, start visit if not
            $candidate_visit = $this->getCandidateVisit($cand_id, $visit);
            if (empty($candidate_visit['stages'])) {
                // Get date of visit value
                $date_visit       = ''; // The redcap data point
                $date_visit_field = ''; // The redcap variable name

                // If there are multiple REDCap fields for date of visit,
                // use the first field in list with a non empty value
                $redcap_field = $mapping['dateOfVisit'];
                if (is_array($redcap_field)) {
                    $date_visit_field = current(
                        array_filter(
                            $redcap_field,
                            function ($i) use ($row) {
                                return isset($row[$i]) && strlen($row[$i]) != 0;
                            }
                        )
                    );
                } else {
                    $date_visit_field = $redcap_field;
                }

                $date_visit = $row[$date_visit_field] ?? '';

                // Validate start visit values
                if ($date_visit === '' || strtotime($date_visit) === false) {
                    $error_message = "Cannot start visit $visit for candidate $pscid: date_visit missing or invalid.";
                    print "\t\t$error_message\n";
                    $this->errors[$pscid][] = $error_message;
                    continue;
                }

                // Format date_visit, and scrub if required
                $date_visit = new \DateTime($date_visit);
                if (array_key_exists($date_visit_field, $this->dates_to_scrub)) {
                    $date_visit = $this->scrubDate(
                        $date_visit,
                        $this->dates_to_scrub[$date_visit_field]['component']
                    )->format($this->dates_to_scrub[$date_visit_field]['format']);
                }

                // Start the visit
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

            // Get redcap raw event
            $raw_event = $row[$mapping['visit']];
            if ($this->exportLabel) {
                $raw_event = $this->getRedcapEvent($row[$mapping['visit']]);
            }

            // Get visit site
            $site = $this->getVisitSite($cand_id, $visit);

            foreach ($instrument_list as $instrument) {
                // Handle instruments where name is different in REDCap and LORIS
                $redcap_instrument_name = $instrument;
                $mapping_key            = array_search($instrument, $this->getInstrumentMapping());
                if ($mapping_key !== false) {
                    $redcap_instrument_name = $mapping_key;
                }

                // Get REDCap instrument data
                $redcap_data = $this->getRedcapInstrumentData($pscid, $raw_event, $redcap_instrument_name);

                if ($redcap_data == null || empty($redcap_data)) {
                    // No redcap data to import for pscid, visit, instrument
                    // combination between date range if given
                    continue;
                }

                print "\n\t\tInstrument $instrument:\n";

                // Get LORIS instrument data
                $loris_data = $this->getLorisInstrumentData($cand_id, $visit, $instrument);
                $flags_data = $this->getLorisFlagsData($cand_id, $visit, $instrument);

                // Get values to save for LORIS metadata fields: administration and validity flags, examiner_id, date_taken
                $administration_flag = $this->getAdministrationFlag($redcap_data, $redcap_instrument_name);
                $validity_flag       = $this->getValidityFlag($redcap_data, $redcap_instrument_name);
                $data_entry_flag     = $this->getDataEntryFlag($redcap_data, $redcap_instrument_name);
                $examiner_id         = null;
                $date_taken          = '';

                // Get examiner field from redcap data and validate if in LORIS
                $redcap_examiner = '';
                $examiner_field  = $this->getExaminerMapping()[$instrument] ?? null;

                // If examiner field not available, set examiner as "N/A"
                // If field available, but no data, leave as ""
                // If field available, but doesn't exist in redcap data, throw error
                if ($examiner_field === null) {
                    $redcap_examiner = "N/A";
                } else {
                    // extract value from recap_data
                    if (!isset($redcap_data[$examiner_field])) {
                        print "\n\t\t\tField $examiner_field not found in REDCap data. No Examiner data available.";
                        print "\n\t\t\tSkipping saving $instrument data for $pscid at $visit.\n\n";
                        $error_message          = "$pscid $visit $instrument: Examiner field $examiner_field does not exist in REDCap data.";
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
                        $error_message          = "$pscid $visit $instrument: Examiner $redcap_examiner at site $site does not exist in LORIS.";
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
                $date_taken_field = $this->getDateTakenMapping()[$instrument] ?? null;

                if ($date_taken_field === null) {
                    print "\n\t\t\tDate_taken equivalent field not found in REDCap data. No Date_taken data available.\n";
                    print "\n\t\t\tSkipping saving $instrument data for $pscid at $visit.\n\n";
                    $error_message          = "$pscid $visit $instrument: Date_taken field equivalent does not exist in REDCap data.";
                    $this->errors[$pscid][] = $error_message;
                    // print to output
                    fwrite(STDERR, $error_message . PHP_EOL);
                    continue;
                }

                if (!isset($redcap_data[$date_taken_field])) {
                    print "\n\t\t\tField $date_taken_field not found in REDCap data. No Date_taken data available.";
                    print "\n\t\t\tSkipping saving $instrument data for $pscid at $visit.\n\n";
                    $error_message          = "$pscid $visit $instrument: Date_taken field $date_taken_field does not exist in REDCap data.";
                    $this->errors[$pscid][] = $error_message;
                    // print to output
                    fwrite(STDERR, $error_message . PHP_EOL);
                    continue;
                }

                $date_taken = $redcap_data[$date_taken_field];

                if ($date_taken !== '' && strtotime($date_taken) !== false) {
                    $date_taken = new \DateTime($date_taken);
                    if (array_key_exists($date_taken_field, $this->dates_to_scrub)) {
                        $date_taken = $this->scrubDate(
                            $date_taken,
                            $this->dates_to_scrub[$date_taken_field]['component']
                        )->format($this->dates_to_scrub[$date_taken_field]['format']);
                    }
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

                    // check if field is a site specific field
                    // and skip over if candidate is not from a configured site
                    if (array_key_exists($fieldname, $this->site_specific_fields)) {
                        if (!in_array($site, $this->site_specific_fields[$fieldname])) {
                            continue;
                        }
                    }

                    // handle multiselect, extract LORIS fieldname from REDCap fieldname
                    if ($this->exportLabel && strpos($fieldname, "___") !== false) {
                        $isMultiSelect = true;
                        $fieldname     = substr($fieldname, 0, strpos($fieldname, "___"));
                    }

                    // if fieldname includes '_status', map to fieldname in LORIS (without "_status")
                    if (strpos($fieldname, "_status") !== false) {
                        $status_fields = $this->getStatusFieldsMapping();
                        if (array_key_exists($fieldname, $status_fields)) {
                            $fieldname = $status_fields[$fieldname];
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

                    // Format date field, and scrub if required
                    if (strpos($fieldname, 'date') !== false
                        || array_key_exists($fieldname, $this->dates_to_scrub)
                    ) {
                        if (!empty($value) && strtotime($value) !== false) {
                            $value = new \DateTime($value);
                            if (array_key_exists($fieldname, $this->dates_to_scrub)) {
                                $value = $this->scrubDate(
                                    $value,
                                    $this->dates_to_scrub[$fieldname]['component']
                                )->format($this->dates_to_scrub[$fieldname]['format']);
                            }
                        }
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
                if ($examiner_id !== null
                    && $examiner_id != htmlspecialchars_decode($loris_data['Examiner'])
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
                if ($date_taken !== ''
                    && $date_taken != htmlspecialchars_decode($loris_data['Date_taken'])
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
                        $instrument_new_data = $new_data[$pscid][$visit][$instrument] ?? [];
                        $new_data[$pscid][$visit][$instrument] = array_merge($instrument_new_data, $instrument_data);
                    }
                } else {
                    print "\t\t\tNo instrument data to save.\n";
                }

                // Save Administration flag
                // Once flag is set in LORIS DB, cannot patch to NULL with API
                if ($administration_flag !== null
                    && $administration_flag != $flags_data['administration']
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
                if ($validity_flag !== null
                    && $validity_flag != $flags_data['validity']
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
     * Creates run log
     *
     * @param array $new_candidates List of new candidates created
     * @param array $new_consents   List of updated candidate consents
     * @param array $new_visits     List of new visits created
     * @param array $new_data       List of new and updated candidate behavioural data
     *
     * @return void
     */
    function createRunLog(array $new_candidates, array $new_consents, array $new_visits, array $new_data) : void
    {
        print "\nNew candidates: ".count($new_candidates)."\n";
        print_r($new_candidates);

        print "\nNew consent data: ".count($new_consents)." candidates\n";
        print_r($new_consents);

        print "\nNew visits: ".count($new_visits)."\n";
        print_r($new_visits);

        print "\nNew behavioural data: ".count($new_data)." candidates\n";
        print_r($new_data);

        print "\nMissing fields: ".count($this->missing_fields)."\n";
        print_r($this->missing_fields);

        print "\nErrors: ".count($this->errors)."\n";
        print_r($this->errors);
    }

    /*
     * Get candidate instrument administration flag from REDCap data.
     * In REDCap, 2=Complete, 1=Unverified, 0=Incomplete
     *
     * @param array  $data       The redcap data
     * @param string $instrument The instrument name
     *
     * @return ?string The instrument adminstration flag
     */
    function getAdministrationFlag(array $data, string $instrument) : ?string
    {
        $administrationMapping = $this->redcapConfig->getInstrumentFlagsMapping()[$instrument]['administration'] ?? null;

        if ($administrationMapping === null) {
            return null;
        }

        $administration_field  = $administrationMapping['id'];
        $administration_status = $administrationMapping['statusMapping'];

        return array_search($data[$administration_field], $administration_status) ?: null;
    }

    /*
     * Get candidate instrument validity flag from REDCap data.
     *
     * @param array  $data       The redcap data
     * @param string $instrument The instrument name
     *
     * @return ?string The instrument validity flag
     */
    function getValidityFlag(array $data, string $instrument) : ?string
    {
        $validityMapping = $this->redcapConfig->getInstrumentFlagsMapping()[$instrument]['validity'] ?? null;

        if ($validityMapping === null) {
            return null;
        }

        $validity_field  = $validityMapping['id'];
        $validity_status = $validityMapping['statusMapping'];

        return array_search($data[$validity_field], $validity_status) ?: null;
    }

    /*
     * Get candidate instrument Data Entry flag from REDCap data.
     *
     * @param array  $data       The redcap data
     * @param string $instrument The instrument name
     *
     * @return ?string The instrument Data Entry flag
     */
    function getDataEntryFlag(array $data, string $instrument) : ?string
    {
        $dataEntryMapping = $this->redcapConfig->getInstrumentFlagsMapping()[$instrument]['dataEntry'] ?? null;

        if ($dataEntryMapping === null) {
            return null;
        }

        $data_entry_field  = $dataEntryMapping['id'];
        $data_entry_status = $dataEntryMapping['statusMapping'];

        return array_search($data[$data_entry_field], $data_entry_status) ?: null;
    }

    /**
     * Get candidate instrument REDCap record
     *
     * @param string $record_id The REDCap record id, the candidate id
     * @param string $event     The raw event name, the visit
     * @param string $form      The form name, the instrument
     *
     * @return ?array The redcap form records
     */
    function getRedcapInstrumentData(string $record_id, string $event, string $form) : ?array
    {
        $NUM_OF_ATTEMPTS = 3;
        $attempts        = 0;
        $records         = null;

        do {
            try {
                $records = $this->redcapClient->_exportRecords(
                    $record_id,
                    $event,
                    $form,
                    $this->exportLabel,
                    $this->redcapDateRangeBegin,
                    $this->redcapDateRangeEnd
                );
            } catch (Exception $e) {
                $attempts++;
                sleep(60);
                continue;
            }
            break;
        } while ($attempts < $NUM_OF_ATTEMPTS);

        return $records;
    }

    /**
     * Get candidate instrument LORIS data
     *
     * @param string $cand_id    The candidate id, the DCCID
     * @param string $visit      The visit label
     * @param string $instrument The instrument name
     *
     * @return ?array The instrument data
     */
    function getLorisInstrumentData(string $cand_id, string $visit, string $instrument) : ?array
    {
        try {
            $apiInstance = new Swagger\Client\Api\InstrumentsApi(
                $this->httpClient,
                $this->lorisApiConfig
            );
            $result      = $apiInstance->candidatesIdVisitInstrumentsInstrumentGet($cand_id, $visit, $instrument)['data'];
        } catch (Exception $e) {
            print "\nException when calling InstrumentsApi->candidatesIdVisitInstrumentsInstrumentGet: \n" . $e->getMessage() . PHP_EOL;
            return null;
        }

        if (empty($result) || is_null($result)) {
            return null;
        }

        return $result;
    }

    /**
     * Get candidate instrument LORIS flags data
     *
     * @param string $cand_id    The candidate id, the DCCID
     * @param string $visit      The visit label
     * @param string $instrument The instrument name
     *
     * @return ?Swagger\Client\Model\InstrumentFlagsFlags The instrument flags data
     */
    function getLorisFlagsData(string $cand_id, string $visit, string $instrument) : ?Swagger\Client\Model\InstrumentFlagsFlags
    {
        $result = new \Swagger\Client\Model\InstrumentFlagsFlags();

        try {
            $apiInstance = new Swagger\Client\Api\InstrumentsApi(
                $this->httpClient,
                $this->lorisApiConfig
            );
            $result      = $apiInstance->candidatesIdVisitInstrumentsInstrumentFlagsGet($cand_id, $visit, $instrument)['flags'];
        } catch (Exception $e) {
            print "\n\t\t\tException when calling InstrumentsApi->candidatesIdVisitInstrumentsInstrumentFlagsGet: \n" . $e->getMessage() . PHP_EOL;
            return null;
        }

        if (empty($result) || is_null($result)) {
            return null;
        }

        return $result;
    }

    function setInstrumentData(
        string                       $candid,
        string                       $visit,
        string                       $instrument,
        array                        $instrumentData,
        Swagger\Client\Configuration $clientConfig
    ) : bool {
        $apiInstance = new Swagger\Client\Api\InstrumentsApi(
            $this->httpClient,
            $this->lorisApiConfig
        );

        $meta = new \Swagger\Client\Model\InstrumentMeta(
            [
                'instrument' => $instrument,
                'visit'      => $visit,
                'candidate'  => $candid,
                'dde'        => false,
            ]
        );

        $body = new \Swagger\Client\Model\Instrument(
            [
                'meta' => $meta,
                'data' => $instrumentData
            ]
        );

        try {
            $apiInstance->candidatesIdVisitInstrumentsInstrumentPatch(
                $candid,
                $visit,
                $instrument,
                $body
            );
        } catch (Exception $e) {
            print "\nException when calling InstrumentsApi->candidatesIdVisitInstrumentsInstrumentPatch: " . $e->getMessage() . PHP_EOL;
            return false;
        }

        return true;
    }

    function setInstrumentAdministrationFlag(
        string                       $candid,
        string                       $visit,
        string                       $instrument,
        string                       $administration,
        Swagger\Client\Configuration $clientConfig
    ) : bool {

        $apiInstance = new Swagger\Client\Api\InstrumentsApi(
            $this->httpClient,
            $this->lorisApiConfig
        );

        $meta = new \Swagger\Client\Model\InstrumentMeta(
            [
                'instrument' => $instrument,
                'visit'      => $visit,
                'candidate'  => $candid,
                'dde'        => false,
            ]
        );

        $flags = new \Swagger\Client\Model\InstrumentFlagsFlags(
            [
                'administration' => $administration
            ]
        );

        $body = new \Swagger\Client\Model\InstrumentFlags(
            [
                'meta'  => $meta,
                'flags' => $flags
            ]
        );

        try {
            $apiInstance->candidatesIdVisitInstrumentsInstrumentFlagsPatch(
                $candid,
                $visit,
                $instrument,
                $body
            );
        } catch (Exception $e) {
            print "\nException when calling InstrumentsApi->candidatesIdVisitInstrumentsInstrumentFlagsPatch: " . $e->getMessage() . PHP_EOL;
            return false;
        }

        return true;
    }

    function setInstrumentValidityFlag(
        string                       $candid,
        string                       $visit,
        string                       $instrument,
        string                       $validity,
        Swagger\Client\Configuration $clientConfig
    ) : bool {

        $apiInstance = new Swagger\Client\Api\InstrumentsApi(
            $this->httpClient,
            $this->lorisApiConfig
        );

        $meta = new \Swagger\Client\Model\InstrumentMeta(
            [
                'instrument' => $instrument,
                'visit'      => $visit,
                'candidate'  => $candid,
                'dde'        => false,
            ]
        );

        $flags = new \Swagger\Client\Model\InstrumentFlagsFlags(
            [
                'validity' => $validity
            ]
        );

        $body = new \Swagger\Client\Model\InstrumentFlags(
            [
                'meta'  => $meta,
                'flags' => $flags
            ]
        );

        try {
            $apiInstance->candidatesIdVisitInstrumentsInstrumentFlagsPatch(
                $candid,
                $visit,
                $instrument,
                $body
            );
        } catch (Exception $e) {
            print "\nException when calling InstrumentsApi->candidatesIdVisitInstrumentsInstrumentFlagsPatch: " . $e->getMessage() . PHP_EOL;
            return false;
        }

        return true;
    }

    /**
     * Checks if candidate exists by its id
     *
     * @param $id The candidate id, the PSCID or DCCID
     *
     * @return bool True if candidate exists
     */
    function candidateExists(string $id) : bool
    {
        return $this->getCandidate($id) ? true : false;
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
     * Gets candidate object
     *
     * @param $id The candidate id, DCCID or PSCID
     *
     * @return ?\Swagger\Client\Model\InlineResponse2002
     */
    function getCandidate(string $id) : ?\Swagger\Client\Model\InlineResponse2002
    {
        try {
            $api    = new Swagger\Client\Api\CandidatesApi(
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
    ) : ?\Swagger\Client\Model\Candidate {
        $apiInstance = new Swagger\Client\Api\CandidatesApi(
            $this->httpClient,
            $this->lorisApiConfig
        );

        $candidate = new \Swagger\Client\Model\NewCandidateCandidate(
            [
                'project' => $project,
                'pscid'   => $pscid,
                'site'    => $site,
                'do_b'    => $do_b,
                'sex'     => $sex,
            ]
        );

        $body = new \Swagger\Client\Model\NewCandidate(
            [
                'candidate' => $candidate
            ]
        );

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

    function scrubDate(\DateTime $datetime, array $components) : \DateTime
    {
        // Grab each component wtihout leading zeros
        $day   = $datetime->format('j');
        $month = $datetime->format('n');
        $year  = $datetime->format('Y');

        foreach ($components as $component => $value) {
            switch ($component) {
            case 'day':
                $day = strval($value);
                break;
            case 'month';
                $month = strval($value);
                break;
            case 'year';
                $year = strval($value);
                break;
            }
        }

        return $datetime->setDate($year, $month, $day);
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
    function getConsentListByGroup(string $group) : array
    {
        $query = "SELECT c.ConsentID AS ConsentID, c.Name AS Name, c.Label AS Label FROM consent c
            LEFT JOIN consent_group cg USING (ConsentGroupID)
            WHERE cg.Name=:consent_group";
        $where = ['consent_group' => $group];
        $key   = 'ConsentID';

        $result = $this->DB->pselectWithIndexKey($query, $where, $key);

        return $result;
    }

    /**
     * Update specific candidate's consent data
     *
     * @param string    $cand_id        The candidate id, the DCCID
     * @param string    $pscid          The candidate id, the PSCID
     * @param string    $consent_id     The consent id
     * @param string    $consent_name   The consent name
     * @param string    $consent_label  The consent label
     * @param string    $consent_status The REDCap consent status
     * @param \DateTime $consent_date   The REDCap consent date
     * @param string    $consenter_name The REDCap consenter's name
     * @param bool      $update         True if candidate consent already exists in LORIS,
     *                                  and needs to be updated. False if consent is new,
     *                                  and needs saving.
     *
     * @return ?array The update_consent_rel array, or null if consent didn't update
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
     * Checks if visit exists by its visit label and cand id
     *
     * @param $dccid       The candidate id, DCCID
     * @param $visit_label The visit label
     *
     * @return bool True if visit exists
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
     * @return ?\Swagger\Client\Model\InlineResponse2003 The visit object
     */
    function getCandidateVisit(string $dccid, string $visit) : ?\Swagger\Client\Model\InlineResponse2003
    {
        try {
            $apiInstance = new Swagger\Client\Api\VisitApi(
                $this->httpClient,
                $this->lorisApiConfig
            );
            $result      = $apiInstance->candidatesIdVisitGet($dccid, $visit);
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
    ) : ?\Swagger\Client\Model\InlineResponse2003 {
        $apiInstance = new Swagger\Client\Api\VisitApi(
            $this->httpClient,
            $this->lorisApiConfig
        );

        $body = new \Swagger\Client\Model\VisitMetaFields(
            [
                'cand_id' => $candid,
                'visit'   => $visit,
                'site'    => $site,
                'battery' => $subproject,
                'project' => $project,
            ]
        );

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
     * Starts a visit with Not Started stage
     *
     * @param \Swagger\Client\Model\InlineResponse2003 $visit      The visit object with properties
     * @param \DateTime                                $date_visit The date of visit
     *
     * @return bool True if the visit succesfully started
     */
    function startVisit(\Swagger\Client\Model\InlineResponse2003 $visit, \DateTime $date_visit) : bool
    {
        $cand_id     = $visit['meta']['cand_id'];
        $visit_label = $visit['meta']['visit'];
        $site        = $visit['meta']['site'];
        $battery     = $visit['meta']['battery'];
        $project     = $visit['meta']['project'];

        // Start visit
        // Swagger-php docs for VisitPatchFields model is missing
        // properties from VisitMetaFields, but VisitPatchFields
        // model lib correctly extends VisitMetaFields
        $body = new \Swagger\Client\Model\VisitPatchFields(
            [
                'cand_id' => $cand_id,
                'visit'   => $visit_label,
                'site'    => $site,
                'battery' => $battery,
                'project' => $project,
                'stages'  => new \Swagger\Client\Model\InstrumentVisit(
                    [
                        'visit' => new \Swagger\Client\Model\VisitStage(
                            [
                                'date'   => $date_visit,
                                'status' => 'In Progress',
                            ]
                        )
                    ]
                )
            ]
        );

        try {
            $apiInstance = new Swagger\Client\Api\VisitApi($this->httpClient, $this->lorisApiConfig);
            $apiInstance->candidatesIdVisitPatch($cand_id, $visit_label, $body);
        } catch (Exception $e) {
            return false;
        }

        return true;
    }

    /**
     * Gets the list of instruments in the candidate's visit's test battery
     *
     * @param string $cand_id The candidate id, the DCCID
     * @param string $visit   The visit label
     *
     * @return ?array The list of instruments
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

    /**
     * Get unique event name for REDCap by event label
     *
     * @param $event_label The REDCap event label
     *
     * @return string The redcap unique event name
     */
    function getRedcapEvent(string $event_label) : string
    {
        $events = $this->redcapClient->_exportEvents();

        $event_name = explode(" ", $event_label)[0];
        $arm        = str_replace(':', '', explode(" ", $event_label)[3]);

        foreach ($events as $event) {
            if ($event['event_name'] == $event_name
                && $event['arm_num'] == $arm
            ) {
                return $event['unique_event_name'];
            }
        }
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
     * Checks if an examiner name exists in the LORIS DB
     * at a given site
     *
     * @param string $examiner The examiner name
     * @param string $site     The site at which the examiner is registered
     *
     * @return bool True if the examiner exists
     */
    function examinerExistsAtSite(string $examiner, string $site) : bool
    {
        $examiner_id = $this->getExaminerID($examiner);

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
     * Get examiner ID for given examiner name in LORIS DB
     *
     * @param $examiner The examiner name
     *
     * @return ?string The examiner id
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
}
