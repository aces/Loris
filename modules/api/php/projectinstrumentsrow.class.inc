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
    private $_shortname;
    private $_fullname;
    private $_subgroupname;
    private $_isDDE;

    /**
     * Create a new ProjectImagesRow.
     *
     * @param array $row An array of image properties
     */
    public function __construct(array $row)
    {
        $shortname      = $row['shortname'] ?? null;
        $ddeinstruments = array_keys(\Utility::getAllDDEInstruments());

        $this->_shortname    = $shortname;
        $this->_fullname     = $row['fullname'] ?? null;
        $this->_subgroupname = $row['subgroupname'] ?? null;
        $this->_isDDE        = in_array(
            $shortname,
            $ddeinstruments,
            true
        );
    }

    /**
     * Accessor for shortname.
     *
     * @return string|null
     */
    public function getShortname(): ?string
    {
        return $this->_shortname;
    }

    /**
     * Accessor for fullname.
     *
     * @return string|null
     */
    public function getFullname(): ?string
    {
        return $this->_fullname;
    }

    /**
     * Accessor for subgroupname.
     *
     * @return string|null
     */
    public function getSubgroupname(): ?string
    {
        return $this->_subgroupname;
    }

    /**
     * Accessor for isDDE.
     *
     * @return bool
     */
    public function isDDE(): bool
    {
        return $this->_isDDE;
    }

    /**
     * Implements \LORIS\Data\DataInstance interface for this row.
     *
     * @return string the row data.
     */
    public function toJSON() : string
    {
        return json_encode($this->_toArray());
    }

    /**
     * Provide an array representation of this instrument row.
     *
     * @return array
     */
    private function _toArray() : array
    {
        return array(
                'shortname' => $this->_shortname,
                'fullname'  => $this->_fullname,
                'subgroup'  => $this->_subgroupname,
                'ddeenable' => $this->_isDDE,
               );
    }
}
