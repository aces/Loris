<?php declare(strict_types=1);

/**
 * This represents a REDCap importer
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class RedcapConfig
{
    private string $project;
    private string $configFilePath;
    private array  $import_config;

    function __construct($project)
    {
        $this->configFilePath = __DIR__ . "/redcap_config_$project.json";
        $this->import_config  = $this->_load();
    }

    private function _load(): array
    {
        return json_decode(file_get_contents($this->configFilePath), true);
    }

    /**
     * Gets the importer configurations, with mappings of REDCap and LORIS fields
     *
     * @return array the mapping with loris field as key,
     *               and redcap field as value(s)
     */
    function getImporterConfig(): array
    {
        return $this->import_config;
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
        return $this->getImporterConfig()['metadataMapping'];
    }

    /**
     * Gets the mapping of cohort labels in REDCap and LORIS
     *
     * @return array the mapping with redcap site as key,
     *               and loris site as value
     */
    function getCohortMapping() : array
    {
        $config  = $this->getImporterConfig()['cohortMapping'];
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
        $config  = $this->getImporterConfig()['siteMapping'];
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
        $config  = $this->getImporterConfig()['sexMapping'];
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
        $config  = $this->getImporterConfig()['visitMapping'];
        $mapping = [];

        foreach ($config as $option) {
            $mapping[$option['redcapValue']] = $option['lorisValue'];
        }

        return $mapping;
    }

    function getInstrumentMapping(): array
    {
        $config  = $this->getImporterConfig()['instrumentMapping'];
        $mapping = [];

        foreach ($config as $option) {
            $mapping[$option['redcapValue']] = $option['lorisValue'];
        }

        return $mapping;
    }

    /**
     * Get the REDCap date_taken field mappings for configured instrument
     *
     * return array The date_taken field names for configured instrument
     */
    function getDateTakenMapping() : array
    {
        $config  = $this->getImporterConfig()['dateTakenMapping'];
        $mapping = [];

        foreach ($config as $option) {
            $mapping[$option['instrument']] = $option['dateTaken'];
        }

        return $mapping;
    }

    /**
     * Gets Loris field names that are different than in REDCap because
     * the string '_status' exists in the REDCap field name, a reserved
     * key word in LORIS.
     *
     * return array
     */
    function getStatusFieldsMapping() : array
    {
        $config  = $this->getImporterConfig()['statusFieldsMapping'];
        $mapping = [];

        foreach ($config as $option) {
            $mapping[$option['redcapValue']] = $option['lorisValue'];
        }

        return $mapping;
    }

    /**
     * Get the REDCap examiner field mapping
     *
     * return array The examiner field names for configured instruments
     */
    function getExaminerMapping() : array
    {
        $config  = $this->getImporterConfig()['examinerMapping'];
        $mapping = [];

        foreach ($config as $option) {
            $mapping[$option['instrument']] = $option['examiner'];
        }

        return $mapping;
    }

    function getSiteSpecificFields(): array
    {
        $config  = $this->getImporterConfig()['siteSpecific'];
        $mapping = [];

        foreach ($config as $option) {
            $mapping[$option['id']] = $option['site'];
        }

        return $mapping;
    }

    function getDatesToScrub(): array
    {
        $config = $this->getImporterConfig()['datesToScrub'];
        $dates  = [];

        foreach ($config as $date_field) {
            // Handle components to scrub
            $components = [];
            foreach ($date_field['component'] as $component) {
                $components[$component['id']] = $component['value'];
            }

            $dates[$date_field['id']] = [
                'format'    => $date_field['format'],
                'component' => $components
            ];
        }

        return $dates;
    }

    function getFieldsToIgnore(): array
    {
        return $this->getImporterConfig()['toIgnore'];
    }

    function getConsentMapping(): array
    {
        $config  = $this->getImporterConfig()['consentMapping'];
        $mapping = [];

        foreach ($config as $consent) {
            $mapping[$consent['consentId']] = $consent;
        }

        return $mapping;
    }

    function getInstrumentFlagsMapping(): array
    {
        $config  = $this->getImporterConfig()['instrumentFlagsMapping'];
        $mapping = [];

        foreach ($config as $instrument) {
            $administration = $instrument['administration'] ?? null;
            $validity       = $instrument['validity'] ?? null;
            $dataEntry      = $instrument['dataEntry'] ?? null;

            $mapping[$instrument['instrument']] = [
                'administration' => $administration,
                'validity'       => $validity,
                'dataEntry'      => $dataEntry
            ];
        }
    }

    /**
     * Gets the REDCap report Id from importer configurations
     *
     * @return int the REDCap Report ID
     */
    public function getReportId() : int
    {
        return $this->getImporterConfig()['reportId'];
    }
}
