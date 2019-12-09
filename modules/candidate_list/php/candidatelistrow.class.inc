<?php declare(strict_types=1);
/**
 * This class implements a data Instance which represents a single
 * row in the candidate list menu table.
 *
 * PHP Version 7
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */

namespace LORIS\candidate_list;

/**
 * A CandidateListRow represents a row in the Candidate List menu table.
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class CandidateListRow implements \LORIS\Data\DataInstance
{
    protected $DBRow;
    protected $CenterID;
    protected $ProjectID;

    /**
     * Create a new CandidateListRow
     *
     * @param array   $row The row (in the same format as \Database::pselectRow
     *                     returns
     * @param integer $cid The centerID affiliated with this row.
     * @param integer $pid The projectID affiliated with this row.
     */
    public function __construct(array $row, int $cid, int $pid)
    {
        $this->DBRow     = $row;
        $this->CenterID  = $cid;
        $this->ProjectID = $pid;
    }

    /**
     * Implements \LORIS\Data\DataInstance interface for this row.
     *
     * @return string the row data.
     */
    public function toJSON() : string
    {
        return json_encode($this->DBRow);
    }

    /**
     * Returns the CenterID for this row, for filters such as
     * \LORIS\Data\Filters\UserSiteMatch to match again.
     *
     * @return integer The CenterID
     */
    public function getCenterID(): int
    {
        return $this->CenterID;
    }

    /**
     * Returns the ProjectID for this row, for filters such as
     * \LORIS\Data\Filters\UserProjectMatch to match again.
     *
     * @return integer The ProjectID
     */
    public function getProjectID(): int
    {
        return $this->ProjectID;
    }
}
