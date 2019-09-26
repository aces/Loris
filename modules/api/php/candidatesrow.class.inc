<?php declare(strict_types=1);
/**
 * This class implements a data Instance for candidates.
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
     * @param array $row An array of candidate's propeties
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
     * @return string the row data.
     */
    public function toJSON() : string
    {
        $obj = array(
                'CandID'  => $this->_candid,
                'Project' => $this->_projectname,
                'PSCID'   => $this->_pscid,
                'Site'    => $this->_sitename,
                'EDC'     => $this->_edc,
                'DoB'     => $this->_dob,
                'Sex'     => $this->_sex,
               );

        return json_encode($obj);
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
}
