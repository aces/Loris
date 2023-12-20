<?php
/**
 * This class implements a data Instance which represents a single
 * row in the Consent menu table.
 *
 * PHP Version 7
 *
 * @category Behavioural
 * @package  Main
 * @author   Camille Beaudoin <camille.beaudoin@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\consent;

/**
 * A ConsentRow represents a row in the Consent menu table.
 *
 * @category Behavioural
 * @package  Main
 * @author   Camille Beaudoin <camille.beaudoin@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class ConsentRow implements \LORIS\Data\DataInstance
{
    protected $DBRow;
    protected $CenterID;
    protected $ProjectID;

    /**
     * Create a new ConsentRow
     *
     * @param array   $row The row (in the same format as \Database::pselectRow
     *                     returns
     * @param integer $cid The centerID affiliated with this row.
     */
    public function __construct(array $row)
    {
        $this->DBRow     = $row;
        $this->CenterID  = $row['RegistrationCenterID'];
        $this->ProjectID = $row['RegistrationProjectID'];
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
     * @var    \ProjectID
     * @return \ProjectID The ProjectID
     */
    public function getProjectID(): \ProjectID
    {
        return $this->ProjectID;
    }
}