<?php declare(strict_types=1);

/**
 * This class implements a data Instance which represents a single
 * row in the imaging browser menu table.
 *
 * PHP Version 7
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */

namespace LORIS\imaging_browser;

/**
 * A ImagingBrowserRow represents a row in the Imaging Browser menu table.
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class ImagingBrowserRow implements \LORIS\Data\DataInstance,
    \LORIS\StudyEntities\SiteHaver
{
    protected $DBRow;
    protected \CenterID $CenterID;
    protected $ProjectID;

    /**
     * Create a new ImagingBrowserRow
     *
     * @param array     $row The row (in the same format as \Database::pselectRow
     *                       returns
     * @param \CenterID $cid The centerID affiliated with this row.
     * @param integer   $pid The projectID affiliated with this row.
     */
    public function __construct(array $row, \CenterID $cid, int $pid)
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
     * Returns the ProjectID for this row
     *
     * @return integer The CenterID
     */
    public function getProjectID(): int
    {
        return $this->ProjectID;
    }


    /**
     * This tells if the image is a phantom.
     *
     * @return bool True is the Entity_type is a scanner
     */
    public function isPhantom(): bool
    {
        return $this->DBRow['entityType'] === 'Scanner';
    }
}
