<?php declare(strict_types=1);
/**
 * This class implements a data Instance which represents a single
 * row in the survey accounts menu table.
 *
 * PHP Version 7
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Core
 * @author     Dave MacFarlane <dave.macfarlane@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */

namespace LORIS\survey_accounts;

/**
 * A SurveyAccountsRow represents a row in the survey accounts
 * menu table.
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Core
 * @author     Dave MacFarlane <dave.macfarlane@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class SurveyAccountsRow implements \LORIS\Data\DataInstance
{
    protected $DBRow;
    protected $CenterID;
    protected $ProjectID;

    /**
     * Create a new SurveyAccountsRow
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
     * @return array which can be serialized by json_encode()
     */
    public function jsonSerialize() : array
    {
        return $this->DBRow;
    }

    /**
     * Returns the CenterID for this row
     *
     * @return integer The CenterID
     */
    public function getCenterID(): int
    {
        return $this->CenterID;
    }

    /**
     * Returns the ProjectID for this row
     *
     * @return integer The ProjectID
     */
    public function getProjectID(): int
    {
        return $this->ProjectID;
    }
}
