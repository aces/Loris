<?php declare(strict_types=1);

/**
 * This represents a REDCap Configuration
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class RedcapConfig
{
    private string $_project;
    private string $_config_file_path;
    private array  $_import_config;

    /**
     * Create a new instance
     *
     * @param $project The REDCap project
     */
    public function __construct($project)
    {
        $this->_project          = $project;
        $this->_config_file_path = __DIR__ . "/redcap_config_$project.json";
        $this->_import_config    = $this->_load();
    }

    /**
     * Load the contents of the redcap config file
     *
     * @return array The config contents
     */
    private function _load(): array
    {
        return json_decode(file_get_contents($this->_config_file_path), true);
    }

    /**
     * Gets the importer configurations, with mappings of REDCap and LORIS fields
     *
     * @return array the mapping with loris field as key,
     *               and redcap field as value(s)
     */
    private function _getImporterConfig(): array
    {
        return $this->_import_config;
    }

    /**
     * Gets the mapping of meta data field names for candidates and visit
     * in REDCap and LORIS
     *
     * @return array the mapping with loris field as key,
     *               and redcap field as value(s)
     */
    public function getMetadataMapping() : array
    {
        return $this->_getImporterConfig()['metadataMapping'];
    }

    /**
     * Gets the mapping of cohort labels in REDCap and LORIS
     *
     * @return array the mapping with redcap site as key,
     *               and loris site as value
     */
    public function getCohortMapping() : array
    {
        $config  = $this->_getImporterConfig()['cohortMapping'];
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
    public function getSiteMapping() : array
    {
        $config  = $this->_getImporterConfig()['siteMapping'];
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
    public function getSexMapping() : array
    {
        $config  = $this->_getImporterConfig()['sexMapping'];
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
    public function getVisitMapping() : array
    {
        $config  = $this->_getImporterConfig()['visitMapping'];
        $mapping = [];

        foreach ($config as $option) {
            $mapping[$option['redcapValue']] = $option['lorisValue'];
        }

        return $mapping;
    }

    /**
     * Get the REDCap to LORIS mapping for instruments that don't
     * have idential names in both platforms
     *
     * @return array The list of instrument
     */
    public function getInstrumentMapping(): array
    {
        $config  = $this->_getImporterConfig()['instrumentMapping'];
        $mapping = [];

        foreach ($config as $option) {
            $mapping[$option['redcapValue']] = $option['lorisValue'];
        }

        return $mapping;
    }

    /**
     * Get the REDCap date_taken field mappings for configured instrument
     *
     * @return array The date_taken field names for configured instrument
     */
    public function getDateTakenMapping() : array
    {
        $config  = $this->_getImporterConfig()['dateTakenMapping'];
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
     * @return array
     */
    public function getStatusFieldsMapping() : array
    {
        $config  = $this->_getImporterConfig()['statusFieldsMapping'];
        $mapping = [];

        foreach ($config as $option) {
            $mapping[$option['redcapValue']] = $option['lorisValue'];
        }

        return $mapping;
    }

    /**
     * Get the REDCap examiner field mapping
     *
     * @return array The examiner field names for configured instruments
     */
    public function getExaminerMapping() : array
    {
        $config  = $this->_getImporterConfig()['examinerMapping'];
        $mapping = [];

        foreach ($config as $option) {
            $mapping[$option['instrument']] = $option['examiner'];
        }

        return $mapping;
    }

    /**
     * Get the list of site specific fields to import
     * only for provided sites
     *
     * @return array The list of fields
     */
    public function getSiteSpecificFields(): array
    {
        $config  = $this->_getImporterConfig()['siteSpecific'];
        $mapping = [];

        foreach ($config as $option) {
            $mapping[$option['id']] = $option['site'];
        }

        return $mapping;
    }

    /**
     * Get the date fields to be scrubbed,
     * along with the date component to scrub,
     * the value to scrub it with, and format
     *
     * @return array The date fields, with their components
     */
    public function getDatesToScrub(): array
    {
        $config = $this->_getImporterConfig()['datesToScrub'];
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

    /**
     * Get the list of fields to ignore from importing
     *
     * @return array The list of fields
     */
    public function getFieldsToIgnore(): array
    {
        return $this->_getImporterConfig()['toIgnore'];
    }

    /**
     * Get the consent mapping
     *
     * @return array The mapping
     */
    public function getConsentMapping(): array
    {
        $config  = $this->_getImporterConfig()['consentMapping'];
        $mapping = [];

        foreach ($config as $consent) {
            $mapping[$consent['consentId']] = $consent;
        }

        return $mapping;
    }

    /**
     * Get the instrument flags mapping
     *
     * @return array The mapping
     */
    public function getInstrumentFlagsMapping(): array
    {
        $config  = $this->_getImporterConfig()['instrumentFlagsMapping'];
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

        return $mapping;
    }

    /**
     * Gets the REDCap report Id from importer configurations
     *
     * @return int the REDCap Report ID
     */
    public function getReportId() : int
    {
        return $this->_getImporterConfig()['reportId'];
    }
}
