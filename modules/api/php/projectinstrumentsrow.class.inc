<?php declare(strict_types=1);
/**
 * This class implements a data Instance for project's instruments.
 *
 * PHP Version 7
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\api;

/**
 * A ProjectInstrumentsRow represents an instrument summary for a given project.
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class ProjectInstrumentsRow implements \LORIS\Data\DataInstance
{
    protected $DBRow;

    /**
     * Create a new ProjectImagesRow.
     *
     * @param array $row An array of image propeties
     */
    public function __construct(array $row)
    {
        $this->DBRow = $row;
    }

    /**
     * Implements \LORIS\Data\DataInstance interface for this row.
     *
     * @return string the row data.
     */
    public function toJSON() : string
    {
        return json_encode($this->toArray());
    }

    /**
     * Provide an array representation of this instrument row.
     *
     * @return array
     */
    public function toArray() : array
    {
        return array(
                'shortname' => $this->getShortname(),
                'fullname'  => $this->getFullname(),
                'subgroup'  => $this->getSubgroupname(),
                'ddeenable' => $this->getDDEEnable(),
               );
    }

    /**
     * Returns this row's shortname.
     *
     * @return string
     */
    public function getShortname() : string
    {
        return $this->DBRow['shortname'] ?? null;
    }

    /**
     * Returns this row's fullname.
     *
     * @return string
     */
    public function getFullname() : string
    {
        return $this->DBRow['fullname'] ?? null;
    }

    /**
     * Retruns this row's subgroupname
     *
     * @return string
     */
    public function getSubgroupname() : string
    {
        return $this->DBRow['subgroupname'] ?? null;
    }

    /**
     * Checks if this instrument is part of the double data entry instruments
     * This use \Utility::getAllDDEInstruments() because the information is not
     * in the database and the instrument class do not provide a isDDE function.
     *
     * @return bool
     */
    public function getDDEEnable() : bool
    {
        // FIXME :: This should come from the database but DDE instruments are
        // still in config.xml
        return in_array($this->getShortname(), \Utility::getAllDDEInstruments());
    }
}
