<?php declare(strict_types=1);
/**
 * This class implements a data Instance which represents a single
 * row in the dicom archive menu table.
 *
 * PHP Version 7
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Electrophysiology
 * @author     Cecile Madjar <cecile.madjar@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */

namespace LORIS\electrophysiology_browser;

/**
 * A DICOMArchiveRow represents a row in the DICOM Archive menu table.
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Electrophysiology
 * @author     Cecile Madjar <cecile.madjar@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class ElectrophysiologyBrowserRow implements \LORIS\Data\DataInstance
{
    protected $DBRow;
    protected $CenterID;
    protected $ProjectID;

    /**
     * Create a new ElectrophysiologyBrowserRow
     *
     * @param array   $row The row (in the same format as \Database::pselectRow
     *                     returns
     * @param integer $cid The centerID affiliated with this row.
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
     * Returns the ProjectID for this row
     *
     * @return integer The ProjectID
     */
    public function getProjectID(): int
    {
        return $this->ProjectID;
    }
}
