<?php declare(strict_types=1);

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
     * @param \LORIS\LorisInstance $loris          The LORIS instance that data is being
     *                                             imported from.
     * @param string               $project        The LORIS project to import for
     * @param bool                 $exportLabel    The export label boolean
     * @param \LORIS\LorisInstance $loris          The LORIS instance that data is being
     *                                             imported from.
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
        parent::__construct($loris, $project, $exportLabel, $dateRangeBegin, $dateRangeEnd);

        $this->redcapReportId = getReportId();
    }

    /**
     * Fetches the records from REDCap
     *
     * @return array $records The array of records in the REDCap report
     */
    public function fetchRecords() : array
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
    public function getReportId() : int
    {
        return $this->redcapConfig->getImporterConfig('reportId');
    }
}

