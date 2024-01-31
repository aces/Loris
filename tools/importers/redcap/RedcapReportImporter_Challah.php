<?php declare(strict_types=1);

require_once __DIR__ . '/../../generic_includes.php';

require 'RedcapReportImporter.php';

/**
 * This file contains code to import REDCap data into LORIS.
 * The script first sends an API request to export a REDCap
 * report of filtered record_ids, and then exports each record's
 * instrument data. Each record in the REDCap report represents
 * a visit (a REDCap event).
 *
 * This script can either be run to import all instrument data
 * from REDCap, or only query REDCap data that has been created
 * or modified within the last given number of days. The tag --since
 * can be appended to the calling of the script to provide the
 * number of days from which to fetch data.
 *
 * Usage: php RedcapReportImporter_Challah.php [--since 14]
 *
 * PHP 8
 *
 * @category Main
 * @package  Main
 * @author   Zaliqa Rosli <zaliqa.rosli@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

/**
 * This file contains code to import records from a REDCap report into LORIS
 *
 * PHP 8
 *
 * @category Main
 * @package  Main
 * @author   Zaliqa Rosli <zaliqa.rosli@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class RedcapReportImporter_Challah extends RedcapReportImporter
{
    /**
     * Create new instance.
     *
     * @param \LORIS\LorisInstance $loris          The LORIS instance that data is
     *                                             being imported from.
     * @param string               $project        The LORIS project to import for
     * @param bool                 $exportLabel    The export label boolean
     * @param ?string              $dateRangeBegin Date string 'YYYY-MM-DD HH:MM:SS'
     *                                             after which REDCap records were
     *                                             created or modified
     * @param ?string              $dateRangeEnd   Date string 'YYYY-MM-DD HH:MM:SS'
     *                                             before which REDCap records were
     *                                             created or modified
     *
     * @return array
     */
    public function __construct(
        \LORIS\LorisInstance $loris,
        string               $project,
        bool                 $exportLabel = false,
        ?string              $dateRangeBegin = null,
        ?string              $dateRangeEnd = null
    ) {
        parent::__construct(
            $loris,
            $project,
            $exportLabel,
            $dateRangeBegin,
            $dateRangeEnd
        );
    }
}

$project     = 'Challah';
$exportLabel = true;

$dateRangeBegin = null;
$dateRangeEnd   = null;

// Get days since to query REDCap data
$opts = getopt("", ["since:"]);
if (array_key_exists('since', $opts) && $opts['since'] != null) {
    $days_since = $opts['since'];
    // Set timezone to Montreal
    date_default_timezone_set("America/New_York");
    $dateRangeEnd   = date("Y-m-d H:i:s");
    $dateRangeBegin = new DateTime($dateRangeEnd);
    $dateRangeBegin->sub(new DateInterval("P{$days_since}D"));
    $dateRangeBegin = $dateRangeBegin->format("Y-m-d H:i:s");
}

$Runner = new RedcapReportImporter_Challah(
    $lorisInstance,
    $project,
    $exportLabel,
    $dateRangeBegin,
    $dateRangeEnd
);

$Runner->run();

