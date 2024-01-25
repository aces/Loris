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

        print "\nCreating candidates..\n\n";
        // record is at the visit level i.e. redcap_event_name
        foreach ($records as $row) {
            $mapping = $this->getMetadataMapping();
            $pscid   = $row[$mapping['pscid']];

            // If candidate already exists in LORIS, skip
            if ($this->candidateExists($pscid)) {
                continue;
            }

            $site    = '';
            $dob     = '';
            $sex     = '';
            $project = $this->project;
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
    abstract function createNewVisits(array $records) : array;

    /**
     * Update candidate consent
     *
     * @param array $records Array of REDCap records
     *
     * @return array $new_consents Array of consent data imported
     */
    abstract function updateCandidateConsents(array $records) : array;
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
        return getImporterConfig()['cohortMapping'];
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

        foreach($config as $option) {
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

        foreach($config as $option) {
            $mapping[$option['redcapValue']] = $option['lorisValue'];
        }

        return $mapping;
    }

    /**
     * Get visit mapping for LORIS by REDCap visit label
     *
     * @param $visit_label The REDCap visit label
     *
     * @return ?string The Loris visit value for the redcap visit label
     */
    function getVisitMapping (string $visit_label) : ?string
    {
        return getImporterConfig()['visitMapping'];
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
}

