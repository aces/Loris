<?php declare(strict_types=1);
/**
 * This class implements a data Instance for project's images
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
 * A ProjectImagesRow represents an image for a given project.
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class ProjectImagesRow implements \LORIS\Data\DataInstance
{
    protected $DBRow;

    /**
     * Create a new ProjectImagesRow
     *
     * @param array $row An array of image propeties
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
        $obj = $this->DBRow;

        $filename = basename($obj['File']);
        $candid   = $obj['Candidate'];
        $visit    = $obj['Visit'];

        $obj['Link']       = "/candidates/$candid/$visit/images/$filename";
        $obj['InsertTime'] = date('c', (int) $obj['InsertTime']);

        unset($obj['CenterID']);
        unset($obj['Entity_type']);

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
        return $this->DBRow['CenterID'];
    }

    /**
     * This tells is the image is a phantom.
     *
     * @return bool True is the Entity_type is a scanner
     */
    public function isPhantom(): bool
    {
        return $this->DBRow['Entity_type'] === 'Scanner';
    }
}
