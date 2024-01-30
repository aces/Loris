<?php declare(strict_types=1);

require_once __DIR__ . '/../../../php/libraries/SwaggerClient-php/vendor/autoload.php';

namespace LORIS\redcap\Importers;

use LORIS\redcap\RedcapHttpClient;
use LORIS\redcap\RedcapConfig;

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

    var $errors = [];          // error handling
    var $missing_fields = [];  // REDCap fields not in LORIS

    var $site_specific_fields; // only site candidates will have these field values imported
    var $dates_to_scrub;       // Specify date fields that don't have the string 'date' in the fieldname
    var $fields_to_ignore;     // REDCap fields to ignore and not import into LORIS

    var $project;

    /**
     * Create new instance.
     *
     * @param \LORIS\LorisInstance $loris The LORIS instance that data is being
     *                                    imported from.
     */
    function __construct(\LORIS\LorisInstance $loris, string $project)
    {
        $this->loris = $loris;
        $this->DB    = $this->loris->getDatabaseConnection();

        $config    = $this->loris->getConfiguration();
        $apiConfig = $config->getSetting('REDCap');

        $this->redcapClient = new RedcapHttpClient($loris);
        $this->redcapConfig = new RedcapConfig($project);

        $this->lorisApiConfig = new Swagger\Client\Configuration();
        $this->lorisApiConfig = Swagger\Client\Configuration::getDefaultConfiguration()->setHost(
            $apiConfig['loris']['baseurl']
        );

        $this->lorisApiConfig = $this->_loginApi(
            $this->lorisApiConfig,
            $apiConfig['loris']['username'],
            $apiConfig['loris']['password']
        );

        $this->httpClient = new GuzzleHttp\Client();

        // Set up data field restrictions, specifications
        $this->site_specific_fields = $this->getSiteSpecificFields();
        $this->dates_to_scrub   = $this->getDatesToScrub();
        $this->fields_to_ignore = $this->getFieldsToIgnore();

        $this->project = $project;
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
    private function _loginApi(
        Swagger\Client\Configuration $config,
        string $username,
        string $password
    ): Swagger\Client\Configuration {
        $loginApiInstance = new Swagger\Client\Api\LoginApi(
            $this->httpClient,
            $config
        );

        $token = $loginApiInstance->loginPost(
            new \Swagger\Client\Model\Body([
                'username' => $username,
                'password' => $password,
            ])
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
    function run()
    {
        $records = $this->_fetchRecords();

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
    private function _fetchRecords() : ?array
    {
        return $this->redcapClient->_exportRecords() ?: null;
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
            $pscid   = $row[$mapping['pscid']];

            // If candidate already exists in LORIS, skip
            if ($this->candidateExists($pscid)) {
                continue;
            }

            $site    = '';
            $dob     = '';
            $sex     = '';

            foreach ($mapping as $loris_field => $redcap_field) {o

                $val = ''; // The redcap data point
                $var = ''; // The redcap variable name

                // If there are multiple REDCap fields for a given LORIS field,
                // use the first field in list with a non empty value
                if (is_array($redcap_field)) {
                    $var = current(array_filter($redcap_field, function ($i) use ($row) {
                        return isset($row[$i]) && strlen($row[$i]) != 0;
                    }));
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
            if ($pscid   === '' ||
                $site    === '' ||
                $sex     === '' ||
                $project === '' ||
                $dob     === '' ||
                strtotime($dob) === false
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

            // Get row visit label
            $visit = $this->getVisitMapping($row[$mapping['visit']]);
            if ($visit === null) {
                print "\tCreating visit " . $row[$mapping['visit']] . " for $pscid failed.\n";
                $this->errors[$pscid][] = "Cannot create visit " . $row[$mapping['visit']]
                                        . " for candidate $pscid: visit label invalid.";
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

            // If visit already exists in LORIS, skip
            if ($this->visitExists($dccid, $visit)) {
                continue;
            }

            // Get cohort value
            $cohort       = ''; // The redcap data point
            $cohort_field = ''; // The redcap variable name

            // If there are multiple REDCap fields for cohort,
            // use the first field in list with a non empty value
            $redcap_field = $mapping['cohort');
            if (is_array($redcap_field) {
                $cohort_field = current(array_filter($redcap_field, function ($i) use ($row) {
                    return isset($row[$i]) && strlen($row[$i]) != 0;
                }));
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
                $consent_name   = $consent['Name'];
                $consent_label  = $consent['Label'];

                // Check if consent data is empty but not '0'
                if (empty($row[$consent_name]) && strlen($row[$consent_name]) == 0) {
                    // No consent information
                    continue;
                }

                // Redcap consent data, set consent values
                $consent_status  = array_search(
                    $row[$consent_name],
                    $consent_mapping[$consent_name]['statusMapping']
                );
                $consent_date    = $row[$consent_mapping[$consent_name]['consentDateField']] ?? '';

                $consenter_field = $consent_mapping[$consent_name]['consenterField'] ?? null;
                $consenter_name  = ($consenter_field !== null  && !empty($row[$consenter_field]))
                                   ? $row[$consenter_field] . ' (REDCap)'
                                   : '(REDCap)';

                // Validate
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
                    $this->dates_to_scrub)
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
    abstract function updateCandidateData(array $records) : array;

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
    function createRunLog(array $new_candidates, array $new_consents, array $new_visits, array $new_data)
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

    /**
     * Gets the importer configurations, with mappings of REDCap and LORIS fields
     *
     * @return array the mapping with loris field as key,
     *               and redcap field as value(s)
     */
    function getImporterConfig() : array
    {
       return $this->redcapConfig->getImportConfig();
    }

    /**
     * Gets the mapping of meta data field names for candidates and visit
     * in REDCap and LORIS
     *
     * @return array the mapping with loris field as key,
     *               and redcap field as value(s)
     */
    function getMetadataMapping() : array
    {
        return getImporterConfig()['metadataMapping'];
    }

    /**
     * Gets the mapping of cohort labels in REDCap and LORIS
     *
     * @return array the mapping with redcap site as key,
     *               and loris site as value
     */
    function getCohortMapping() : array
    {
        $config  = getImporterConfig()['cohortMapping'];
        $mapping = [];

        foreach ($config as $option) {
            $mapping[$option['redcapValue']] = $option['lorisValue'];
        }

        return $mapping;
    }

    /**
     * Gets the mapping of site names in REDCap and LORIS
     *
     * @return array the mapping with redcap site as key,
     *               and loris site as value
     */
    function getSiteMapping() : array
    {
        $config  = getImporterConfig()['siteMapping'];
        $mapping = [];

        foreach ($config as $option) {
            $mapping[$option['redcapValue']] = $option['lorisValue'];
        }

        return $mapping;
    }

    /**
     * Gets the mapping of gender/sex in REDCap and LORIS
     *
     * @return array the mapping with redcap gender as key,
     *               and loris sex as value
     */
    function getSexMapping() : array
    {
        $config  = getImporterConfig()['sexMapping'];
        $mapping = [];

        foreach ($config as $option) {
            $mapping[$option['redcapValue']] = $option['lorisValue'];
        }

        return $mapping;
    }

    /**
     * Get visit mapping for LORIS by REDCap visit in config file
     *
     * @return array An array of visit mapping
     */
    function getVisitMapping() : array
    {
        $config  = getImporterConfig()['visitMapping'];
        $mapping = [];

        foreach ($config as $option) {
            $mapping[$option['redcapValue']] = $option['lorisValue'];
        }

        return $mapping;
    }

    function getInstrumentMapping(): array
    {
        return getImporterConfig()['instrumentMapping'];
    }

    /**
     * Get the REDCap date_taken field for given instrument
     *
     * @param string $instrument The instrument name
     *
     * return ?string The date_taken field name for that instrument,
     *                or null if doesn't exist
     */
    function getDateTakenMapping(string $instrument) : ?string
    {
        return getImporterConfig()['dateTakenMapping'];
    }

    /**
     * Gets Loris field names that are different than in REDCap because
     * the string '_status' exists in the REDCap field name, a reserved
     * key word in LORIS.
     *
     * @param string $fieldname The field name in REDcap
     *
     * return ?string The LORIS equivalent field name
     */
    function getStatusFieldsMapping(string $fieldname) : ?string
    {
        return getImporterConfig()['statusFieldsMapping'];
    }

    /**
     * Get the REDCap examiner field for given instrument
     *
     * @param string $instrument The instrument name
     *
     * return ?string The examiner field name for that instrument,
     *                or null if doesn't exist
     */
    function getExaminerMapping(string $instrument) : ?string
    {
        return getImporterConfig()['examinerMapping'];
    }

    function getSiteSpecificFields(): array
    {
        return getImporterConfig()['siteSpecific'];
    }

    function getDatesToScrub(): array
    {
        $config = getImporterConfig()['datesToScrub'];
        $dates  = [];

        foreach ($config as $date_field) {
            // Handle components to scrub
            $components = [];
            foreach ($date_field['component'] as $component) {
                $components[$component['id']] = $component['value'];
            }

            $dates[$date_field['id']] = [
                'format'    = $date_field['format'],
                'component' = $components
            ];
        }

        return $dates;
    }

    function getFieldsToIgnore(): array
    {
        return getImporterConfig()['toIgnore'];
    }

    function getConsentMapping(): array
    {
        $config  = getImporterConfig()['consentMapping'];
        $mapping = [];

        foreach ($config as $consent) {
            $mapping[$consent['consentId']] = $consent;
        }
    }

    /**
     * Get candidate instrument REDCap record
     *
     * @param string $record_id  The REDCap record id, the candidate id
     * @param string $event      The raw event name, the visit
     * @param string $form       The form name, the instrument
     *
     * return ?array The redcap form records
     */
    function getRedcapInstrumentData(string $record_id, string $event, string $form) : ?array
    {
        return $this->redcapClient->_exportRecords(
            $record_id,
            $event,
            $form
        ) ?: null;
    }

    /**
     * Get candidate instrument LORIS data
     *
     * @param string $cand_id    The candidate id, the DCCID
     * @param string $visit      The visit label
     * @param string $instrument The instrument name
     *
     * return ?array The instrument data
     */
    function getLorisInstrumentData(string $cand_id, string $visit, string $instrument) : ?array
    {
        try {
            $apiInstance = new Swagger\Client\Api\InstrumentsApi(
                $this->httpClient,
                $this->lorisApiConfig
            );
            $result = $apiInstance->candidatesIdVisitInstrumentsInstrumentGet($cand_id, $visit, $instrument)['data'];
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
     * return ?Swagger\Client\Model\InstrumentFlagsFlags The instrument flags data
     */
    function getLorisFlagsData(string $cand_id, string $visit, string $instrument) : ?Swagger\Client\Model\InstrumentFlagsFlags
    {
        $result = new \Swagger\Client\Model\InstrumentFlagsFlags();

        try {
            $apiInstance = new Swagger\Client\Api\InstrumentsApi(
                $this->httpClient,
                $this->lorisApiConfig
            );
            $result = $apiInstance->candidatesIdVisitInstrumentsInstrumentFlagsGet($cand_id, $visit, $instrument)['flags'];
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
    
        $meta              = new \Swagger\Client\Model\InstrumentMeta([
            'instrument' => $instrument,
            'visit'      => $visit,
            'candidate'  => $candid,
            'dde'        => false,
        ]);
    
        $body = new \Swagger\Client\Model\Instrument([
            'meta' => $meta,
            'data' => $instrumentData
        ]);
    
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
    
        $meta              = new \Swagger\Client\Model\InstrumentMeta([
            'instrument' => $instrument,
            'visit'      => $visit,
            'candidate'  => $candid,
            'dde'        => false,
        ]);
    
        $flags = new \Swagger\Client\Model\InstrumentFlagsFlags([
            'administration' => $administration
        ]);
    
        $body = new \Swagger\Client\Model\InstrumentFlags([
            'meta'  => $meta,
            'flags' => $flags
        ]);
    
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
    
        $meta              = new \Swagger\Client\Model\InstrumentMeta([
            'instrument' => $instrument,
            'visit'      => $visit,
            'candidate'  => $candid,
            'dde'        => false,
        ]);
    
        $flags = new \Swagger\Client\Model\InstrumentFlagsFlags([
            'validity' => $validity
        ]);
    
        $body = new \Swagger\Client\Model\InstrumentFlags([
            'meta'  => $meta,
            'flags' => $flags
        ]);
    
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
     * return bool True if candidate exists
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
    function getConsentListByGroup(string $group) : array {
        $query        = "SELECT c.ConsentID AS ConsentID, c.Name AS Name, c.Label AS Label FROM consent c
            LEFT JOIN consent_group cg USING (ConsentGroupID)
            WHERE cg.Name=:consent_group";
        $where        = array('consent_group' => $group);
        $key          = 'ConsentID';

        $result = $this->DB->pselectWithIndexKey($query, $where, $key);

        return $result;
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
}
