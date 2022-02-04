<?php declare(strict_types=1);
/**
 * This class implements a data Instance which represents a single
 * test in the battery manager menu table.
 *
 * PHP Version 7
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Henri Rabalais <henri.rabalais@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */

namespace LORIS\battery_manager;

/**
 * A Test represents a row in the Battery Manager menu table.
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Henri Rabalais <henri.rabalais@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class Test implements
    \LORIS\Data\DataInstance,
    \LORIS\StudyEntities\MultiSiteHaver
{
    public $row;
    private ?\CenterID $center;
    private \LORIS\LorisInstance $loris;

    /**
     * Create a new Test Instance.
     *
     * @param \LORIS\LorisInstance $loris  The LORIS instance with the test
     * @param ?\CenterID           $center The site this test is
                                           applied at, if applicable
     * @param array                $row    The row (in the same format as
                                           \Database::pselectRow returns
     */
    public function __construct(
        \LORIS\LorisInstance $loris,
        ?\CenterID $center,
        array $row
    ) {
        $this->row    = $row;
        $this->center = $center;
        $this->loris  = $loris;
    }

    /**
     * Implements \LORIS\Data\DataInstance interface for this row.
     *
     * @return array which can be serialized by json_encode()
     */
    public function jsonSerialize() : array
    {
        return $this->row;
    }

    /**
     * Returns the CenterID for this row, for filters such as
     * \LORIS\Data\Filters\UserSiteMatch to match again.
     *
     * @return \CenterID[] array The CenterIDs
     */
    public function getCenterIDs() : array
    {
        if ($this->center !== null) {
            return [$this->center];
        }
        return array_map(
            function ($site) {
                return $site->getCenterID();
            },
            $this->loris->getAllSites()
        );
    }

    /**
     * Convert data from Instance to a format suitable for SQL.
     *
     * @return array
     */
    public function toSQL() : array
    {
        return [
            'ID'           => $this->row['id']              ?? null,
            'Test_name'    => $this->row['testName']        ?? null,
            'AgeMinDays'   => $this->row['ageMinDays']      ?? null,
            'AgeMaxDays'   => $this->row['ageMaxDays']      ?? null,
            'Stage'        => $this->row['stage']           ?? null,
            'SubprojectID' => $this->row['subproject']      ?? null,
            'Visit_label'  => $this->row['visitLabel']      ?? null,
            'CenterID'     => $this->row['centerId']        ?? null,
            'firstVisit'   => $this->row['firstVisit']      ?? null,
            'instr_order'  => $this->row['instrumentOrder'] ?? null,
            'Active'       => $this->row['active']          ?? null,
        ];
    }
}
