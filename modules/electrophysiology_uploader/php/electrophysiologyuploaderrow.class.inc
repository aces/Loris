<?php

namespace LORIS\electrophysiology_uploader;

/**
 * This class implements a data Instance which represents a single
 * row in the electrophysiology uploader menu table.
 *
 * PHP Version 7
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Electrophysiology
 * @author     Loris team <info-loris.mni@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class ElectrophysiologyUploaderRow
    implements \LORIS\Data\DataInstance, \LORIS\StudyEntities\SiteHaver
{
    protected $DBRow;
    protected $CenterID;
    protected $ProjectID;

    /**
     * Create a new ElectrophysiologyBrowserRow
     *
     * @param array      $row The row (in the same format as
     *                        \Database::pselectRow returns
     * @param \CenterID  $cid The centerID affiliated with this row.
     * @param \ProjectID $pid The projectID affiliated with this row.
     */
    public function __construct(array $row, \CenterID $cid, \ProjectID $pid)
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
     * @return \ProjectID The ProjectID
     */
    public function getProjectID(): \ProjectID
    {
        return $this->ProjectID;
    }
}
