<?php declare(strict_types=1);
/**
 * PHP Version 7
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\api\Models;

/**
 * A CandidatesRow contains the values from a row in the Database.
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class CandidatesRow implements \LORIS\Data\DataInstance
{
    private $_candid;
    private $_projectname;
    private $_pscid;
    private $_sitename;
    private $_edc;
    private $_dob;
    private $_sex;
    private $_centerid;

    /**
     * Create a new CandidatesRow.
     *
     * @param array $row An array of candidate's properties
     */
    public function __construct(array $row)
    {
        $this->_candid      = $row['CandID'] ?? null;
        $this->_projectname = $row['ProjectName'] ?? null;
        $this->_pscid       = $row['PSCID'] ?? null;
        $this->_sitename    = $row['SiteName'] ?? null;
        $this->_edc         = $row['EDC'] ?? null;
        $this->_dob         = $row['DoB'] ?? null;
        $this->_sex         = $row['Sex'] ?? null;
        $this->_centerid    = $row['CenterID'] ?? null;
    }

    /**
     * Implements \LORIS\Data\DataInstance interface for this row.
     *
     * @return array which can be serialized by json_encode()
     */
    public function jsonSerialize() : array
    {
        $obj = [
            'CandID'    => $this->_candid,
            'Project'   => $this->_projectname,
            'PSCID'     => $this->_pscid,
            'Site'      => $this->_sitename,
            'EDC'       => $this->_edc,
            'DoB'       => $this->_dob,
            'Sex'       => $this->_sex,
        ];

        return $obj;
    }

    /**
     * Returns the CenterID for this row, for filters such as
     * \LORIS\Data\Filters\UserSiteMatch to match against.
     *
     * @return integer The CenterID
     */
    public function getCenterID(): int
    {
        if ($this->_centerid === null) {
            throw new \Exception('CenterID is null');
        }
        return intval($this->_centerid);
    }
<<<<<<< 72ee8e88da77ef65873b9011dad6834213389155

    /**
     * Returns the ProjectID for this row, for filters such as
     * \LORIS\Data\Filters\UserProjectMatch to match against.
     *
<<<<<<< ee86f359947ac42635fc9bb4b0ca8ef09176c66c
<<<<<<< 1f2dc92a69f7659a17ff2046ce5d518f24fde75c
     * @return integer ProjectID
     */
    public function getProjectID(): int
    {
        if ($this->_projectid === null) {
            throw new \Exception('ProjectID is null');
        }
        return intval($this->_projectid);
=======
     * @return string ProjectID
=======
     * @return integer ProjectID
>>>>>>> [API] Candidates are now filtered by allowed project ids
     */
    public function getProjectID(): int
    {
        if ($this->_projectid === null) {
            throw new \Exception('ProjectID is null');
        }
<<<<<<< ee86f359947ac42635fc9bb4b0ca8ef09176c66c
        return intval($this->_projectname);
>>>>>>> [API] Add getProjectID to candidatesrow model
=======
        return intval($this->_projectid);
>>>>>>> [API] Candidates are now filtered by allowed project ids
    }
=======
>>>>>>> [API] changes version in new spec document and removes other errors
}
