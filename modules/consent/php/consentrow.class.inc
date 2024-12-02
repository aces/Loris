<?php declare(strict_types=1);

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
class ConsentRow implements
    \LORIS\Data\DataInstance,
    \LORIS\StudyEntities\SiteHaver
{
    protected $DBRow;
    protected $CenterID;
    protected $ProjectID;

    /**
     * Create a new ConsentRow
     *
     * @param array $row The row (in the same format as \Database::pselectRow)
     */
    public function __construct(array $row)
    {
        $this->DBRow     = $row;
        $this->CenterID  = new \CenterID($row['RegistrationCenterID']);
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
     * @return \CenterID
     */
    public function getCenterID(): \CenterID
    {
        return $this->CenterID;
    }

    /**
     * Returns the ProjectID for this row, for filters such as
     * \LORIS\Data\Filters\UserProjectMatch to match again.
     *
     * @return \ProjectID
     */
    public function getProjectID(): \ProjectID
    {
        return new \ProjectID($this->ProjectID);
    }
}