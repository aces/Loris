<?php
/**
 * This class implements a data Instance which represents a single
 * file in the media menu table.
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

namespace LORIS\media;

/**
 * A Meida File represents a row in the Media menu table.
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Henri Rabalais <henri.rabalais@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class MediaFile implements \LORIS\Data\DataInstance
{
    protected $DBRow;
    protected $CenterID;

    /**
     * Create a new Media File Instance.
     *
     * @param array   $row      The instance (in the same format as
     *                                  \Database::pselectRow returns
     * @param integer $cid      The centerID affiliated with this instance.
     * @param integer $hideFile 0 or 1, whether a file should be hidden.
     */
    public function __construct(array $row, int $cid, int $hideFile)
    {
        $this->DBRow    = $row;
        $this->CenterID = $cid;
        $this->hideFile = $hideFile;
    }

    /**
     * Implements \LORIS\Data\DataInstance interface for this row.
     *
     * @return string the instance data.
     */
    public function toJSON(): string
    {
        return json_encode($this->DBRow);
    }

    /**
     * Returns the CenterID for this intance, for filters such as
     * \LORIS\Data\Filters\UserSiteMatch to match again.
     *
     * @return integer The CenterID
     */
    public function getCenterID(): int
    {
        return $this->CenterID;
    }

    /**
     * Returns the value of the 'Hide File' variable. This is stored in the
     * database as a 0 or a 1. A value of 0 means the file should be shown and
     * a value of 1 means it should be hidden.
     *
     * @return int The value of hideFile.
     */
    public function getHideFile(): int
    {
        return $this->hideFile;
    }
}
