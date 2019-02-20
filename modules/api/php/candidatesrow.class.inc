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
 * A CandidatesRow represents a candidate for the
 * /candidates endpoint.
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class CandidatesRow implements \LORIS\Data\DataInstance
{
    protected $DBRow;

    /**
     * Create a new CandidatesRow
     *
     * @param array $row An array of candidate's propeties
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
        $obj = array(
                'CandID'  => $this->DBRow['CandID'],
                'Project' => $this->DBRow['ProjectName'],
                'PSCID'   => $this->DBRow['PSCID'],
                'Site'    => $this->DBRow['SiteName'],
                'EDC'     => $this->DBRow['EDC'],
                'DoB'     => $this->DBRow['DoB'],
                'Gender'  => $this->DBRow['Sex'],
               );

        return json_encode($obj);
    }

    /**
     * Returns the CenterID for this row, for filters such as
     * \LORIS\Data\Filters\UserSiteMatch to match again.
     *
     * @return integer The CenterID
     */
    public function getCenterID(): int
    {
        return intval($this->DBRow['CenterID']);
    }
}
