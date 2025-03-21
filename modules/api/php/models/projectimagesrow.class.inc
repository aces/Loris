<?php declare(strict_types=1);

/**
 * PHP Version 7
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\api\Models;

/**
 * A ProjectImagesRow contains values from an image of a project.
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class ProjectImagesRow implements \LORIS\Data\DataInstance,
    \LORIS\StudyEntities\SiteHaver
{
    private $_candid;
    private $_pscid;
    private $_entitytype;
    private $_visitlabel;
    private $_visitdate;
    private \CenterID $_centerid;
    private $_centername;
    private $_filename;
    private $_inserttime;
    private $_scantype;
    private $_qcstatus;
    private $_selected;

    /**
     * Create a new ProjectImagesRow
     *
     * @param array $row An array of image propeties
     */
    public function __construct(array $row)
    {
        $this->_candid     = strval($row['Candidate']) ?? null;
        $this->_pscid      = $row['PSCID'] ?? null;
        $this->_entitytype = $row['Entity_type'] ?? null;
        $this->_visitlabel = $row['Visit'] ?? null;
        $this->_visitdate  = $row['Visit_date'] ?? null;
        $this->_centerid   = \CenterID::singleton(intval($row['CenterID']));
        $this->_centername = $row['Site'] ?? null;
        $this->_filename   = $row['File'] ?? null;
        $this->_inserttime = $row['InsertTime'] ?? null;
        $this->_scantype   = $row['ScanType'] ?? null;
        $this->_qcstatus   = $row['QC_status'] ?? null;
        $this->_selected   = $row['Selected'] ?? null;
    }

    /**
     * Implements \LORIS\Data\DataInstance interface for this row.
     *
     * @return array which can be serialized by json_encode()
     */
    public function jsonSerialize() : array
    {
        $obj      = [
            'Candidate'  => $this->_candid,
            'PSCID'      => $this->_pscid,
            'Visit'      => $this->_visitlabel,
            'Visit_date' => $this->_visitdate,
            'Site'       => $this->_centername,
            'InsertTime' => $this->_inserttime,
            'ScanType'   => $this->_scantype,
            'QC_status'  => $this->_qcstatus,
            'Selected'   => $this->_selected,
        ];
        $filename = basename($this->_filename);
        $candid   = $obj['Candidate'];
        $visit    = $obj['Visit'];

        $obj['Link']       = "/candidates/$candid/$visit/images/$filename";
        $obj['InsertTime'] = date('c', (int) $obj['InsertTime']);

        return $obj;
    }

    /**
     * Returns the CenterID for this row, for filters such as
     * \LORIS\Data\Filters\UserSiteMatch to match again.
     *
     * @return \CenterID
     */
    public function getCenterID(): \CenterID
    {
        return $this->_centerid;
    }

    /**
     * This tells is the image is a phantom.
     *
     * @return bool True is the Entity_type is a scanner
     */
    public function isPhantom(): bool
    {
        return $this->_entitytype === 'Scanner';
    }
}
