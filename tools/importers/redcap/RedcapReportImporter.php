<?php declare(strict_types=1);

namespace \LORIS\redcap\Importers;

/**
 * This represents a REDCap Report importer
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
abstract class RedcapReportImporter extends RedcapImporter implements IRedcapReportImporter
{
    private int  $redcapReportId; // REDCap report id
    private bool $exportLabel;    // True or false export the Redcap records as label
                                  // for multiple choice fields. If false, export raw values

    /**
     * Create new instance.
     *
     * @param \LORIS\LorisInstance $loris       The LORIS instance that data is being
     *                                          imported from.
     * @param bool                 $exportLabel The export label boolean
     */
    function __construct(\LORIS\LorisInstance $loris, bool $exportLabel = false, string $project)
    {
        parent::__construct($loris, $project);

        $this->redcapReportId = getReportId();
        $this->exportLabel    = $exportLabel;
    }

    /**
     * Fetches the records from REDCap
     *
     * @return array $records The array of records in the REDCap report
     */
    private function _fetchRecords() : array
    {
        return $this->redcapClient->_exportReport(
            intval($this->redcapReportId),
            $this->exportLabel
        );
    }

    /**
     * Gets the REDCap report Id from importer configurations
     *
     * @return int the REDCap Report ID 
     */
    function getReportId() : int
    {
        return $this->getImporterConfig('reportId');
    }

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
    /**
     * Update candidate instrument data
     *
     * @param array $records Array of REDCap records
     *
     * @return array $new_data Array of instrument data imported
     */
    abstract function updateCandidateData(array $records) : array;
}

