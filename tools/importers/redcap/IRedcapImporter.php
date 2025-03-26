<?php declare(strict_types=1);

require_once __DIR__
    . '/../../../php/libraries/SwaggerClient-php/vendor/autoload.php';

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
    public function loginApi(
        Swagger\Client\Configuration $config,
        string $username,
        string $password
    ) : Swagger\Client\Configuration;

    /**
     * Runs the importer
     *
     * @return void
     */
    public function run() : void;

    /**
     * Fetches the records from REDCap
     *
     * @return ?array $records The array of records in the REDCap report
     */
    public function fetchRecords() : ?array;

    /**
     * Create new candidates
     *
     * @param array $records Array of REDCap records
     *
     * @return array $new_candidates Array of new candidates created
     */
    public function createNewCandidates(array $records) : array;

    /**
     * Create new visits
     *
     * @param array $records Array of REDCap records
     *
     * @return array $new_visits Array of new visits created
     */
    public function createNewVisits(array $records) : array;

    /**
     * Update candidate consent
     *
     * @param array $records Array of REDCap records
     *
     * @return array $new_consents Array of consent data imported
     */
    public function updateCandidateConsents(array $records) : array;

    /**
     * Update candidate instrument data
     *
     * @param array $records Array of REDCap records
     *
     * @return array $new_data Array of instrument data imported
     */
    public function updateCandidateData(array $records) : array;

    /**
     * Creates run log
     *
     * @param array $new_candidates List of new candidates created
     * @param array $new_consents   List of updated candidate consents
     * @param array $new_visits     List of new visits created
     * @param array $new_data       List of new and updated candidate
     *                              behavioural data
     *
     * @return void
     */
    public function createRunLog(
        array $new_candidates,
        array $new_consents,
        array $new_visits,
        array $new_data
    ): void;

    /**
     * Get candidate instrument administration flag from REDCap data.
     * In REDCap, 2=Complete, 1=Unverified, 0=Incomplete
     *
     * @param array  $data       The redcap data
     * @param string $instrument The instrument name
     *
     * @return ?string The instrument adminstration flag
     */
    public function getAdministrationFlag(
        array $data,
        string $instrument
    ) : ?string;

    /**
     * Get candidate instrument validity flag from REDCap data.
     *
     * @param array  $data       The redcap data
     * @param string $instrument The instrument name
     *
     * @return ?string The instrument validity flag
     */
    public function getValidityFlag(
        array $data,
        string $instrument
    ) : ?string;

    /**
     * Get candidate instrument Data Entry flag from REDCap data.
     *
     * @param array  $data       The redcap data
     * @param string $instrument The instrument name
     *
     * @return ?string The instrument Data Entry flag
     */
    public function getDataEntryFlag(
        array $data,
        string $instrument
    ) : ?string;

    /**
     * Get candidate instrument REDCap record
     *
     * @param string $record_id The REDCap record id, the candidate id
     * @param string $event     The raw event name, the visit
     * @param string $form      The form name, the instrument
     *
     * @return ?array The redcap form records
     */
    public function getRedcapInstrumentData(
        string $record_id,
        string $event,
        string $form
    ) : ?array;

    /**
     * Get candidate instrument LORIS data
     *
     * @param string $cand_id    The candidate id, the DCCID
     * @param string $visit      The visit label
     * @param string $instrument The instrument name
     *
     * @return ?array The instrument data
     */
    public function getLorisInstrumentData(
        string $cand_id,
        string $visit,
        string $instrument
    ) : ?array;

    /**
     * Get candidate instrument LORIS flags data
     *
     * @param string $cand_id    The candidate id, the DCCID
     * @param string $visit      The visit label
     * @param string $instrument The instrument name
     *
     * @return ?Swagger\Client\Model\InstrumentFlagsFlags The instrument flags data
     */
    public function getLorisFlagsData(
        string $cand_id,
        string $visit,
        string $instrument
    ) : ?Swagger\Client\Model\InstrumentFlagsFlags;

    /**
     * Save candidate instrument data via LORIS API
     *
     * @param string $candid         The candidate id, the DCCID
     * @param string $visit          The visit label
     * @param string $instrument     The instrument name
     * @param array  $instrumentData The instrument data
     *
     * @return bool True or false data was saved
     */
    public function setInstrumentData(
        string                       $candid,
        string                       $visit,
        string                       $instrument,
        array                        $instrumentData
    ) : bool;

    /**
     * Save candidate instrument flags data via LORIS API
     *
     * @param string $candid     The candidate id, the DCCID
     * @param string $visit      The visit label
     * @param string $instrument The instrument name
     * @param string $flag_type  The flag, one of 'Administration',
     *                           'Validity', 'DataEntry'
     * @param array  $flag_data  The instrument flag data
     *
     * @return bool True or false data was saved
     */
    public function setInstrumentFlag(
        string                       $candid,
        string                       $visit,
        string                       $instrument,
        string                       $flag_type,
        string                       $flag_data
    ) : bool;
}
