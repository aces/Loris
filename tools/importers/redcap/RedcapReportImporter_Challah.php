<?php
/**
 * This file contains code to import REDCap data into LORIS
 *
 * PHP 8
 *
 * @category Main
 * @package  Main
 * @author   Zaliqa Rosli <zaliqa.rosli@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
require_once __DIR__ . '/../../generic_includes.php';
require_once __DIR__ . '/../../../php/libraries/SwaggerClient-php/vendor/autoload.php';

namespace \LORIS\redcap\Importers;

use LORIS\StudyEntities\Candidate\CandID;

$project     = 'Challah';
$exportLabel = true;
$Runner      = new RedcapReportImporter_Challah($lorisInstance, $exportLabel, $project);
$Runner->run();

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
     * @param \LORIS\LorisInstance $loris       The LORIS instance that data is being
     *                                          imported from.
     * @param string               $project     The LORIS project to import for
     * @param bool                 $exportLabel The export label boolean
     *
     * @return array
     */
    function __construct(\LORIS\LorisInstance $loris, string $project, bool $exportLabel = false)
    {
        parent::__construct($loris, $project, $exportLabel);
    }
}
?>
