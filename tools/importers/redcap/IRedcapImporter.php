<?php declare(strict_types=1);

require_once __DIR__ . '/../../../php/libraries/SwaggerClient-php/vendor/autoload.php';

namespace LORIS\redcap\Importers;

/**
 * This interface allows for type abstraction of REDCap importers
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
interface IRedcapImporter
{
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
    ): Swagger\Client\Configuration;

    /**
     * Runs the importer
     *
     * @return void
     */
    public function run(): void;

    /**
     * Fetches the records from REDCap
     *
     * @return array $records The array of records in the REDCap report
     */
    private function _fetchRecords() : array;

    /**
     * Create new candidates
     *
     * @param array $records Array of REDCap records
     *
     * @return array $new_candidates Array of new candidates created
     */
   abstract function createNewCandidates(array $records) : array;

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
    function createRunLog(array $new_candidates, array $new_consents, array $new_visits, array $new_data): void;

    /**
     * Gets the importer configurations, with mappings of REDCap and LORIS fields
     *
     * @return array the mapping with loris field as key,
     *               and redcap field as value(s)
     */
    function getImporterConfig() : array;

    /**
     * Gets the mapping of meta data field names for candidates and visit
     * in REDCap and LORIS
     *
     * @return array the mapping with loris field as key,
     *               and redcap field as value(s)
     */
    function getMetadataFieldMapping() : array;

    /**
     * Gets the mapping of cohort labels in REDCap and LORIS
     *
     * @return array the mapping with redcap site as key,
     *               and loris site as value
     */
    function getCohortMapping() : array;

    /**
     * Gets the mapping of site names in REDCap and LORIS
     *
     * @return array the mapping with redcap site as key,
     *               and loris site as value
     */
    function getSiteMapping() : array;

    /**
     * Gets the mapping of gender/sex in REDCap and LORIS
     *
     * @return array the mapping with redcap gender as key,
     *               and loris sex as value
     */
    function getSexMapping() : array;

    /**
     * Get visit mapping for LORIS by REDCap visit label
     *
     * @param $visit_label The REDCap visit label
     *
     * @return ?string The Loris visit value for the redcap visit label
     */
    function getVisitMapping (string $visit_label) : ?string;

    function getInstrumentMapping(): array;

    /**
     * Get the REDCap date_taken field for given instrument
     *
     * @param string $instrument The instrument name
     *
     * return ?string The date_taken field name for that instrument,
     *                or null if doesn't exist
     */
    function getDateTakenMapping(string $instrument) : ?string;

    /**
     * Gets Loris field names that are different than in REDCap because
     * the string '_status' exists in the REDCap field name, a reserved
     * key word in LORIS.
     *
     * @param string $fieldname The field name in REDcap
     *
     * return ?string The LORIS equivalent field name
     */
    function getStatusFieldsMapping(string $fieldname) : ?string;

    /**
     * Get the REDCap examiner field for given instrument
     *
     * @param string $instrument The instrument name
     *
     * return ?string The examiner field name for that instrument,
     *                or null if doesn't exist
     */
    function getExaminerMapping(string $instrument) : ?string;

    function getSiteSpecificFields(): array;

    function getDateFieldsToScrub(): array;

    function getFieldsToIgnore(): array;

    function getLorisProject(): string;

    /**
     * Get candidate instrument REDCap record
     *
     * @param string $record_id  The REDCap record id, the candidate id
     * @param string $event      The raw event name, the visit
     * @param string $form       The form name, the instrument
     *
     * return ?array The redcap form records
     */
    function getRedcapInstrumentData(string $record_id, string $event, string $form) : ?array;

    /**
     * Get candidate instrument LORIS data
     *
     * @param string $cand_id    The candidate id, the DCCID
     * @param string $visit      The visit label
     * @param string $instrument The instrument name
     *
     * return ?array The instrument data
     */
    function getLorisInstrumentData(string $cand_id, string $visit, string $instrument) : ?array;

    /**
     * Get candidate instrument LORIS flags data
     *
     * @param string $cand_id    The candidate id, the DCCID
     * @param string $visit      The visit label
     * @param string $instrument The instrument name
     *
     * return ?Swagger\Client\Model\InstrumentFlagsFlags The instrument flags data
     */
    function getLorisFlagsData(string $cand_id, string $visit, string $instrument) : ?Swagger\Client\Model\InstrumentFlagsFlags;

    function setInstrumentData(
        string                       $candid,
        string                       $visit,
        string                       $instrument,
        array                        $instrumentData,
        Swagger\Client\Configuration $clientConfig
    ) : bool;

    function setInstrumentAdministrationFlag(
        string                       $candid,
        string                       $visit,
        string                       $instrument,
        string                       $administration,
        Swagger\Client\Configuration $clientConfig
    ) : bool;
    
    function setInstrumentValidityFlag(
        string                       $candid,
        string                       $visit,
        string                       $instrument,
        string                       $validity,
        Swagger\Client\Configuration $clientConfig
    ) : bool;
}
