<?php declare(strict_types=1);

/**
 * PHP Version 8
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\api\Models;

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
    private $_ddeVisits;

    /**
     * Create a new ProjectImagesRow.
     *
     * @param array  $row        An array of image properties
     * @param string $apiversion The version of the API being used
     */
    public function __construct(
        array $row,
        private string $apiversion = 'v0.0.3'
    ) {
        $this->_shortname = $row['shortname'] ?? null;
        $this->_ddeVisits = \NDB_BVL_Battery::getDDEVisitsForInstrument(
            $this->_shortname
        );

        $this->_fullname     = $row['fullname'] ?? null;
        $this->_subgroupname = $row['subgroupname'] ?? null;
        $this->_isDDE        = count($this->_ddeVisits) > 0;
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
     * Accessor for ddeVisits.
     *
     * @return array
     */
    public function getddeVisits(): array
    {
        return $this->_ddeVisits;
    }

    /**
     * Implements \LORIS\Data\DataInstance interface for this row.
     *
     * @return array which can be serialized by json_encode()
     */
    public function jsonSerialize() : array
    {
        $obj = [
            'shortname' => $this->_shortname,
            'fullname'  => $this->_fullname,
            'subgroup'  => $this->_subgroupname,
            'ddeenable' => $this->_isDDE,
            'ddevisits' => $this->_ddeVisits,
        ];
        if ($this->apiversion != 'v0.0.3') {
            // api version >= v0.0.4
            $obj['ddevisits'] = $this->_ddeVisits;
        }
        return $obj;
    }
}
