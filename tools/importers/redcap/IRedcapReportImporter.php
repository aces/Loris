<?php declare(strict_types=1);

/**
 * This interface allows for type abstraction of REDCap Report importers
 * quering the REDCap data from a Report
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
interface IRedcapReportImporter
{
    /**
     * Gets the REDCap report Id from importer configurations
     *
     * @return int the REDCap Report ID
     */
    public function getReportId() : int;
}
