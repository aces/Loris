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
class CandidatesRow implements \LORIS\Data\DataInstance,
    \LORIS\StudyEntities\SiteHaver
{
    private $_candid;
    private $_projectname;
    private $_projectid;
    private $_pscid;
    private $_sitename;
    private $_edc;
    private $_dob;
    private $_sex;
    private \CenterID $_centerid;

    /**
     * Create a new CandidatesRow.
     *
     * @param array $row An array of candidate's properties
     */
    public function __construct(array $row)
    {
        $this->_candid      = $row['CandID'] ?? null;
        $this->_projectname = $row['ProjectName'] ?? null;
        if ($row['ProjectID'] !== null) {
            $this->_projectid = \ProjectID::singleton(intval($row['ProjectID']));
        }
        $this->_pscid    = $row['PSCID'] ?? null;
        $this->_sitename = $row['SiteName'] ?? null;
        $this->_edc      = $row['EDC'] ?? null;
        $this->_dob      = $row['DoB'] ?? null;
        $this->_sex      = $row['Sex'] ?? null;
        $this->_centerid = \CenterID::singleton(intval($row['CenterID']));
    }

    /**
     * Implements \LORIS\Data\DataInstance interface for this row.
     *
     * @return array which can be serialized by json_encode()
     */
    public function jsonSerialize() : array
    {
        $obj = [
            'CandID'  => $this->_candid,
            'Project' => $this->_projectname,
            'PSCID'   => $this->_pscid,
            'Site'    => $this->_sitename,
            'EDC'     => $this->_edc,
            'DoB'     => $this->_dob,
            'Sex'     => $this->_sex,
        ];

        return $obj;
    }

    /**
     * Returns the CenterID for this row, for filters such as
     * \LORIS\Data\Filters\UserSiteMatch to match against.
     *
     * @return \CenterID The CenterID
     */
    public function getCenterID(): \CenterID
    {
        if ($this->_centerid === null) {
            throw new \Exception('CenterID is null');
        }
        return $this->_centerid;
    }

    /**
     * Returns the ProjectID for this row, for filters such as
     * \LORIS\Data\Filters\UserProjectMatch to match against.
     *
     * @return \ProjectID
     */
    public function getProjectID(): \ProjectID
    {
        if ($this->_projectid === null) {
            throw new \Exception('ProjectID is null');
        }
        return $this->_projectid;
    }
}
