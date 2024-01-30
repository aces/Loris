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

    /**
     * Create new instance.
     *
     * @param \LORIS\LorisInstance $loris       The LORIS instance that data is being
     *                                          imported from.
     * @param string               $project     The LORIS project to import for
     * @param bool                 $exportLabel The export label boolean
     */
    function __construct(\LORIS\LorisInstance $loris, string $project, bool $exportLabel = false)
    {
        parent::__construct($loris, $project, $exportLabel);

        $this->redcapReportId = getReportId();
    }

    /**
     * Fetches the records from REDCap
     *
     * @return array $records The array of records in the REDCap report
     */
    private function _fetchRecords() : array
    {
        $NUM_OF_ATTEMPTS = 3;
        $attempts        = 0;
        $records         = null;

        do {
            try {
                $records = $this->redcapClient->_exportReport(
                    intval($this->redcapReportId),
                    $this->exportLabel
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

