<?php declare(strict_types=1);

require 'RedcapImporter.php';

/**
 * This represents a REDCap Report importer
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class RedcapReportImporter extends RedcapImporter
{
    private int  $_redcapReportId; // REDCap report id

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
    public function __construct(
        \LORIS\LorisInstance $loris,
        string               $project,
        bool                 $exportLabel = false,
        ?string              $dateRangeBegin = null,
        ?string              $dateRangeEnd = null
    ) {
        parent::__construct($loris, $project, $exportLabel, $dateRangeBegin, $dateRangeEnd);

        $this->_redcapReportId = $this->redcapConfig->getReportId();
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
                $records = $this->redcapClient->exportReport(
                    intval($this->_redcapReportId),
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
}

